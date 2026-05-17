import { describe, expect, it } from "vitest";
import { AdminDashboardStatsService } from "@/lib/admin-stats/admin-dashboard-stats";
import { EventService } from "@/lib/events/events-service";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { PrivatizationService } from "@/lib/privatizations/privatization-service";
import { InMemoryPrivatizationRepository } from "@/lib/privatizations/in-memory-privatization-repository";
import { ReservationService } from "@/lib/reservations/reservation-service";
import { InMemoryReservationRepository } from "@/lib/reservations/in-memory-reservation-repository";

function eventPayload(overrides: Partial<Parameters<EventService["create"]>[0]> = {}) {
  return {
    slug: `event-${crypto.randomUUID()}`,
    title_fr: "Soiree test",
    title_en: "Test party",
    description_fr: "Description francaise",
    description_en: "English description",
    starts_at: "2099-06-01T22:00:00.000Z",
    ends_at: "2099-06-02T03:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "https://example.com/cover.jpg",
    is_published: true,
    ...overrides
  };
}

async function makeStatsService() {
  const eventService = new EventService(new InMemoryEventRepository());
  const reservationService = new ReservationService(new InMemoryReservationRepository());
  const privatizationService = new PrivatizationService(new InMemoryPrivatizationRepository());
  const galleryService = new GalleryService(new InMemoryGalleryRepository([]));

  return {
    eventService,
    reservationService,
    privatizationService,
    galleryService,
    statsService: new AdminDashboardStatsService({
      eventService,
      reservationService,
      privatizationService,
      galleryService
    })
  };
}

describe("AdminDashboardStatsService", () => {
  it("returns zeroed stats when no admin data exists", async () => {
    const { statsService } = await makeStatsService();

    const stats = await statsService.getStats("2026-05-17T00:00:00.000Z");

    expect(stats).toEqual({
      events: { total: 0, published: 0, upcomingPublished: 0 },
      requests: {
        reservationsTotal: 0,
        reservationsNew: 0,
        privatizationsTotal: 0,
        privatizationsNew: 0
      },
      gallery: { photosTotal: 0, eventsWithPhotos: 0 }
    });
  });

  it("aggregates events, incoming requests and gallery photos", async () => {
    const { eventService, reservationService, privatizationService, galleryService, statsService } =
      await makeStatsService();

    const upcomingPublished = await eventService.create(
      eventPayload({ slug: "upcoming-published", starts_at: "2099-06-01T22:00:00.000Z" })
    );
    await eventService.create(
      eventPayload({ slug: "past-published", starts_at: "2020-06-01T22:00:00.000Z" })
    );
    await eventService.create(
      eventPayload({
        slug: "draft-future",
        is_published: false,
        starts_at: "2099-08-01T22:00:00.000Z",
        ends_at: "2099-08-02T03:00:00.000Z"
      })
    );

    await reservationService.create({
      full_name: "Marie Curie",
      email: "marie@example.com",
      phone: "0604050607",
      guest_count: 4,
      source_locale: "fr",
      consent_rgpd: true
    });
    await privatizationService.create({
      full_name: "Pierre Dupont",
      email: "pierre@example.com",
      phone: "0604050608",
      guest_count: 80,
      source_locale: "fr",
      consent_rgpd: true
    });

    await galleryService.addPhoto({
      event_id: upcomingPublished.id,
      event_slug: upcomingPublished.slug,
      image_url: "https://example.com/photo-1.jpg",
      alt_fr: "Photo 1",
      alt_en: "Photo 1",
      order: 1
    });
    await galleryService.addPhoto({
      event_id: upcomingPublished.id,
      event_slug: upcomingPublished.slug,
      image_url: "https://example.com/photo-2.jpg",
      alt_fr: "Photo 2",
      alt_en: "Photo 2",
      order: 2
    });

    const stats = await statsService.getStats("2026-05-17T00:00:00.000Z");

    expect(stats.events).toEqual({ total: 3, published: 2, upcomingPublished: 1 });
    expect(stats.requests).toEqual({
      reservationsTotal: 1,
      reservationsNew: 1,
      privatizationsTotal: 1,
      privatizationsNew: 1
    });
    expect(stats.gallery).toEqual({ photosTotal: 2, eventsWithPhotos: 1 });
  });
});
