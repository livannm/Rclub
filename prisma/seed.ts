import type { SiteAssetKey } from "@prisma/client";
import { loadProjectEnv } from "../lib/seed/load-env";
import { DEMO_EVENT_IDS, DEMO_GALLERY_PHOTOS } from "../lib/seed/demo-content";

loadProjectEnv();

const GALLERY_MEDIA_IDS = {
  legendR1: "22222222-2222-4222-8222-222222220001",
  legendR2: "22222222-2222-4222-8222-222222220002",
  legendR3: "22222222-2222-4222-8222-222222220003",
} as const;

const SITE_ASSETS: Array<{ key: SiteAssetKey; value: string }> = [
  { key: "logo", value: "/media/logo.png" },
  { key: "home_hero_video", value: "/media/hero.mp4" },
  { key: "home_hero_poster", value: "/media/hero-poster.png" },
];

async function upsertSiteAsset(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  key: SiteAssetKey,
  value: string,
) {
  const existing = await prisma.siteAsset.findFirst({ where: { key } });
  if (existing) {
    await prisma.siteAsset.update({
      where: { id: existing.id },
      data: { value },
    });
    return;
  }

  await prisma.siteAsset.create({
    data: { key, value, locale: "global" },
  });
}

async function getPrisma() {
  const { getPrismaClient } = await import("../lib/prisma/client");
  return getPrismaClient();
}

/** Supprime les evenements crees par les tests e2e (early-*, late-*). */
async function cleanupE2eTestEvents(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  const removed = await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: { startsWith: "early-" } },
        { slug: { startsWith: "late-" } },
      ],
    },
  });
  if (removed.count > 0) {
    console.log(`Seed Rclub — ${removed.count} evenement(s) e2e supprime(s).`);
  }
}

async function seedGallery(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  const galleryRows = [
    { id: GALLERY_MEDIA_IDS.legendR1, photo: DEMO_GALLERY_PHOTOS[0]! },
    { id: GALLERY_MEDIA_IDS.legendR2, photo: DEMO_GALLERY_PHOTOS[1]! },
    { id: GALLERY_MEDIA_IDS.legendR3, photo: DEMO_GALLERY_PHOTOS[2]! },
  ];

  for (const { id, photo } of galleryRows) {
    await prisma.eventMedia.upsert({
      where: { id },
      update: {
        eventId: photo.event_id,
        url: photo.image_url,
        captionFr: photo.alt_fr,
        captionEn: photo.alt_en,
        sortOrder: photo.order,
        type: "photo",
      },
      create: {
        id,
        eventId: photo.event_id,
        url: photo.image_url,
        captionFr: photo.alt_fr,
        captionEn: photo.alt_en,
        sortOrder: photo.order,
        type: "photo",
      },
    });
  }
}

async function seedSampleRequests(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
) {
  await prisma.reservationRequest.deleteMany({
    where: {
      email: { in: ["demo.reservation@rclub.fr", "demo.reviewed@rclub.fr"] },
    },
  });
  await prisma.privatizationRequest.deleteMany({
    where: { email: "demo.privatisation@rclub.fr" },
  });

  await prisma.reservationRequest.createMany({
    data: [
      {
        fullName: "Camille Dupont",
        email: "demo.reservation@rclub.fr",
        phone: "0601020304",
        eventId: DEMO_EVENT_IDS.legendR,
        dateRequested: new Date("2026-05-25T00:00:00.000Z"),
        guestCount: 6,
        message: "Table VIP pour Legend R si possible.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Alex Morgan",
        email: "demo.reviewed@rclub.fr",
        phone: "0607080910",
        eventId: DEMO_EVENT_IDS.adultsOnly,
        dateRequested: new Date("2026-05-30T00:00:00.000Z"),
        guestCount: 4,
        message: "Anniversary night request.",
        status: "reviewed",
        sourceLocale: "en",
        consentRgpd: true,
      },
    ],
  });

  await prisma.privatizationRequest.create({
    data: {
      fullName: "Societe Nebula",
      email: "demo.privatisation@rclub.fr",
      phone: "0611223344",
      eventDate: new Date("2026-06-12T00:00:00.000Z"),
      guestCount: 80,
      budgetRange: "15k - 25k EUR",
      message: "Privatisation complete avec DJ resident.",
      status: "new",
      sourceLocale: "fr",
      consentRgpd: true,
    },
  });
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error(
      "DATABASE_URL manquant. Verifie .env.local avant de lancer le seed.",
    );
  }

  const prisma = await getPrisma();

  console.log("Seed Rclub — site assets...");
  for (const asset of SITE_ASSETS) {
    await upsertSiteAsset(prisma, asset.key, asset.value);
  }

  console.log("Seed Rclub — nettoyage evenements e2e...");
  await cleanupE2eTestEvents(prisma);

  console.log("Seed Rclub — galerie Legend R...");
  await seedGallery(prisma);

  console.log("Seed Rclub — demandes demo...");
  await seedSampleRequests(prisma);

  const [events, photos, reservations, privatizations] = await Promise.all([
    prisma.event.count(),
    prisma.eventMedia.count(),
    prisma.reservationRequest.count(),
    prisma.privatizationRequest.count(),
  ]);

  console.log(
    `Termine: ${events} evenements, ${photos} photos, ${reservations} reservations, ${privatizations} privatisations.`,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
