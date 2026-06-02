import type { SiteAssetKey } from "@prisma/client";
import { loadProjectEnv } from "../lib/seed/load-env";
import { DEMO_EVENT_IDS, DEMO_EVENTS, DEMO_GALLERY_PHOTOS } from "../lib/seed/demo-content";

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

async function seedEvents(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  for (const event of DEMO_EVENTS) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        slug: event.slug,
        titleFr: event.title_fr,
        titleEn: event.title_en,
        descriptionFr: event.description_fr,
        descriptionEn: event.description_en,
        startsAt: new Date(event.starts_at),
        endsAt: event.ends_at ? new Date(event.ends_at) : null,
        location: event.location ?? "Rclub Strasbourg",
        coverImageUrl: event.cover_image_url,
        isPublished: event.is_published,
      },
      create: {
        id: event.id,
        slug: event.slug,
        titleFr: event.title_fr,
        titleEn: event.title_en,
        descriptionFr: event.description_fr,
        descriptionEn: event.description_en,
        startsAt: new Date(event.starts_at),
        endsAt: event.ends_at ? new Date(event.ends_at) : null,
        location: event.location ?? "Rclub Strasbourg",
        coverImageUrl: event.cover_image_url,
        isPublished: event.is_published,
      },
    });
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

const DEMO_RESERVATION_EMAIL_DOMAIN = "@demo.rclub.fr";

async function seedSampleRequests(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
) {
  await prisma.reservationRequest.deleteMany({
    where: { email: { endsWith: DEMO_RESERVATION_EMAIL_DOMAIN } },
  });
  await prisma.privatizationRequest.deleteMany({
    where: { email: { endsWith: DEMO_RESERVATION_EMAIL_DOMAIN } },
  });

  await prisma.reservationRequest.createMany({
    data: [
      /* ── ven8Mai (passé — 23 mai) ── */
      {
        fullName: "Antoine Perrin",
        email: `antoine.perrin${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0603334455",
        eventId: DEMO_EVENT_IDS.ven8Mai,
        dateRequested: new Date("2026-05-23T00:00:00.000Z"),
        guestCount: 5,
        arrivalTime: "23:00",
        tableType: "classique",
        occasionType: "autre",
        status: "confirmed",
        confirmedAt: new Date("2026-05-12T10:00:00.000Z"),
        notifiedAt: new Date("2026-05-12T10:10:00.000Z"),
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Inès Khalil",
        email: `ines.khalil${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0623456789",
        eventId: DEMO_EVENT_IDS.ven8Mai,
        dateRequested: new Date("2026-05-23T00:00:00.000Z"),
        guestCount: 12,
        arrivalTime: "22:00",
        tableType: "vip",
        occasionType: "evg",
        message: "EVG, groupe de 12. Besoin d'un espace totalement privatisé.",
        status: "refused",
        refusedAt: new Date("2026-05-19T10:00:00.000Z"),
        adminNotes: "Groupe trop grand pour un VIP, redirigé vers privatisation.",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Mehdi Larbi",
        email: `mehdi.larbi${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0601112233",
        eventId: DEMO_EVENT_IDS.ven8Mai,
        dateRequested: new Date("2026-05-23T00:00:00.000Z"),
        guestCount: 6,
        arrivalTime: "22:30",
        tableType: "classique",
        occasionType: "anniversaire",
        message: "Anniversaire de ma femme, ambiance festive souhaitée.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Pauline Schmitt",
        email: `pauline.schmitt${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0606667788",
        eventId: DEMO_EVENT_IDS.ven8Mai,
        dateRequested: new Date("2026-05-23T00:00:00.000Z"),
        guestCount: 4,
        arrivalTime: "22:30",
        tableType: "vip",
        occasionType: "evjf",
        message: "EVJF pour ma meilleure amie.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },

      /* ── takeMeBack (passé — 24 mai) ── */
      {
        fullName: "Baptiste Leclerc",
        email: `baptiste.leclerc${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0611223344",
        eventId: DEMO_EVENT_IDS.takeMeBack,
        dateRequested: new Date("2026-05-24T00:00:00.000Z"),
        guestCount: 2,
        arrivalTime: "23:30",
        tableType: "classique",
        status: "confirmed",
        confirmedAt: new Date("2026-05-13T11:00:00.000Z"),
        notifiedAt: new Date("2026-05-13T11:05:00.000Z"),
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Sofiane Chettouh",
        email: `sofiane.chettouh${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0617889900",
        eventId: DEMO_EVENT_IDS.takeMeBack,
        dateRequested: new Date("2026-05-24T00:00:00.000Z"),
        guestCount: 7,
        arrivalTime: "23:30",
        tableType: "classique",
        occasionType: "autre",
        status: "refused",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Théo Vanhout",
        email: `theo.vanhout${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0634567890",
        eventId: DEMO_EVENT_IDS.takeMeBack,
        dateRequested: new Date("2026-05-24T00:00:00.000Z"),
        guestCount: 3,
        arrivalTime: "23:00",
        tableType: "classique",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },

      /* ── legendR (passé — 25 mai) ── */
      {
        fullName: "Nina Dumont",
        email: `nina.dumont${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0619001122",
        eventId: DEMO_EVENT_IDS.legendR,
        dateRequested: new Date("2026-05-25T00:00:00.000Z"),
        guestCount: 3,
        arrivalTime: "22:30",
        tableType: "classique",
        occasionType: "anniversaire",
        message: "Petite table pour un anniversaire en amoureux.",
        status: "confirmed",
        confirmedAt: new Date("2026-05-12T16:00:00.000Z"),
        notifiedAt: new Date("2026-05-12T16:10:00.000Z"),
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Marie Rolland",
        email: `marie.rolland${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0621223344",
        eventId: DEMO_EVENT_IDS.legendR,
        dateRequested: new Date("2026-05-25T00:00:00.000Z"),
        guestCount: 5,
        arrivalTime: "23:00",
        tableType: "vip",
        occasionType: "evjf",
        message: "EVJF, groupe de filles dynamiques.",
        status: "confirmed",
        confirmedAt: new Date("2026-05-16T10:00:00.000Z"),
        notifiedAt: new Date("2026-05-16T10:05:00.000Z"),
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Camille Dupont",
        email: `camille.dupont${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0601020304",
        eventId: DEMO_EVENT_IDS.legendR,
        dateRequested: new Date("2026-05-25T00:00:00.000Z"),
        guestCount: 6,
        arrivalTime: "23:00",
        tableType: "classique",
        occasionType: "anniversaire",
        message: "Table pour un anniversaire, on aimerait être proche de la piste.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },

      /* ── adultsOnly (à venir — 30 mai) ── */
      {
        fullName: "Alex Morgan",
        email: `alex.morgan${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0607080910",
        eventId: DEMO_EVENT_IDS.adultsOnly,
        dateRequested: new Date("2026-05-30T00:00:00.000Z"),
        guestCount: 4,
        arrivalTime: "23:30",
        tableType: "vip",
        occasionType: "evjf",
        message: "EVJF surprise, groupe de 4 filles. Accueil discret apprécié.",
        status: "new",
        sourceLocale: "en",
        consentRgpd: true,
      },
      {
        fullName: "Jordan Petit",
        email: `jordan.petit${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0645678901",
        eventId: DEMO_EVENT_IDS.adultsOnly,
        dateRequested: new Date("2026-05-30T00:00:00.000Z"),
        guestCount: 10,
        arrivalTime: "23:30",
        tableType: "prestige",
        occasionType: "evg",
        message: "EVG classique, groupe sympa.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Emma Wright",
        email: `emma.wright${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0678901234",
        eventId: DEMO_EVENT_IDS.adultsOnly,
        dateRequested: new Date("2026-05-30T00:00:00.000Z"),
        guestCount: 2,
        arrivalTime: "23:00",
        tableType: "vip",
        occasionType: "autre",
        message: "Surprise pour mon copain, occasion spéciale.",
        status: "confirmed",
        confirmedAt: new Date("2026-05-22T16:00:00.000Z"),
        notifiedAt: new Date("2026-05-22T16:10:00.000Z"),
        adminNotes: "Couple, table VIP coin droit confirmée.",
        sourceLocale: "en",
        consentRgpd: true,
      },

      /* ── rFamily (à venir — 31 mai) ── */
      {
        fullName: "Lucas Bernhardt",
        email: `lucas.bernhardt${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0612345678",
        eventId: DEMO_EVENT_IDS.rFamily,
        dateRequested: new Date("2026-05-31T00:00:00.000Z"),
        guestCount: 8,
        arrivalTime: "22:30",
        tableType: "prestige",
        message: "Groupe de collègues, soirée détente.",
        status: "confirmed",
        confirmedAt: new Date("2026-05-20T14:00:00.000Z"),
        notifiedAt: new Date("2026-05-20T14:05:00.000Z"),
        adminNotes: "Confirmé par téléphone. Bouteilles reservées.",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Marco De Luca",
        email: `marco.deluca${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0667890123",
        eventId: DEMO_EVENT_IDS.rFamily,
        dateRequested: new Date("2026-05-31T00:00:00.000Z"),
        guestCount: 5,
        arrivalTime: "00:00",
        tableType: "prestige",
        occasionType: "anniversaire",
        message: "30 ans. Groupe de 5, ambiance festive garantie.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Inaya Leblanc",
        email: `inaya.leblanc${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0639001122",
        eventId: DEMO_EVENT_IDS.rFamily,
        dateRequested: new Date("2026-05-31T00:00:00.000Z"),
        guestCount: 6,
        arrivalTime: "22:30",
        tableType: "vip",
        occasionType: "anniversaire",
        message: "35 ans, groupe mixte, bonne ambiance.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },

      /* ── jun05Thu / Deep Session (à venir — 5 juin) ── */
      {
        fullName: "Maxime Durand",
        email: `maxime.durand${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0645667788",
        eventId: DEMO_EVENT_IDS.jun05Thu,
        dateRequested: new Date("2026-06-05T00:00:00.000Z"),
        guestCount: 4,
        arrivalTime: "23:00",
        tableType: "vip",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Sophie Petit",
        email: `sophie.petit${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0644556677",
        eventId: DEMO_EVENT_IDS.jun05Thu,
        dateRequested: new Date("2026-06-05T00:00:00.000Z"),
        guestCount: 6,
        arrivalTime: "22:00",
        tableType: "prestige",
        occasionType: "evjf",
        message: "EVJF jeudi soir, groupe de 6, on veut une belle table.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },

      /* ── jun06Fri / Nuit Blanche (à venir — 6 juin) ── */
      {
        fullName: "Valentin Moreau",
        email: `valentin.moreau${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0655667788",
        eventId: DEMO_EVENT_IDS.jun06Fri,
        dateRequested: new Date("2026-06-06T00:00:00.000Z"),
        guestCount: 8,
        arrivalTime: "23:00",
        tableType: "vip",
        occasionType: "evg",
        message: "EVG, 8 personnes, on veut profiter à fond.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
      {
        fullName: "Marion Dupont",
        email: `marion.dupont${DEMO_RESERVATION_EMAIL_DOMAIN}`,
        phone: "0658990011",
        eventId: DEMO_EVENT_IDS.jun06Fri,
        dateRequested: new Date("2026-06-06T00:00:00.000Z"),
        guestCount: 6,
        arrivalTime: "22:00",
        tableType: "prestige",
        occasionType: "anniversaire",
        message: "Anniversaire 32 ans, bouteilles souhaitées dès l'arrivée.",
        status: "new",
        sourceLocale: "fr",
        consentRgpd: true,
      },
    ],
  });

  await prisma.privatizationRequest.create({
    data: {
      fullName: "Societe Nebula",
      email: `privatisation${DEMO_RESERVATION_EMAIL_DOMAIN}`,
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

  console.log("Seed Rclub — evenements demo...");
  await seedEvents(prisma);

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
