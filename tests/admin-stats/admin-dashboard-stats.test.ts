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

    expect(stats.events.total).toBe(0);
    expect(stats.events.published).toBe(0);
    expect(stats.events.upcomingPublished).toBe(0);
    expect(stats.events.nextEvent).toBeNull();
    expect(stats.events.upcomingPlanning).toEqual([]);

    expect(stats.requests.reservationsTotal).toBe(0);
    expect(stats.requests.reservationsNew).toBe(0);
    expect(stats.requests.reservationsConfirmed).toBe(0);
    expect(stats.requests.confirmationRate30d).toBe(0);
    expect(stats.requests.cancellationRate90d).toBe(0);
    expect(stats.requests.guestsConfirmedNext7Days).toBe(0);
    expect(stats.requests.guestsConfirmedNext30Days).toBe(0);
    expect(stats.requests.avgGuestsPerConfirmedRes).toBe(0);
    expect(stats.requests.tableTypeBreakdown).toEqual({ classique: 0, prestige: 0, vip: 0 });
    expect(stats.requests.occasionBreakdown).toEqual({ evg: 0, evjf: 0, anniversaire: 0, autre: 0 });
    expect(stats.requests.weeklyTrend).toHaveLength(4);
    expect(stats.requests.weeklyTrend.every((p) => p.count === 0)).toBe(true);
    expect(stats.requests.recentActivity).toEqual([]);

    expect(stats.gallery).toEqual({ photosTotal: 0, eventsWithPhotos: 0 });
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
      arrival_time: "23:00",
      table_type: "classique",
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

    expect(stats.events.total).toBe(3);
    expect(stats.events.published).toBe(2);
    expect(stats.events.upcomingPublished).toBe(1);
    expect(stats.events.nextEvent?.slug).toBe("upcoming-published");
    expect(stats.events.upcomingPlanning).toHaveLength(1);

    expect(stats.requests.reservationsTotal).toBe(1);
    expect(stats.requests.reservationsNew).toBe(1);
    expect(stats.requests.privatizationsTotal).toBe(1);
    expect(stats.requests.privatizationsNew).toBe(1);
    expect(stats.requests.recentActivity).toHaveLength(1);
    expect(stats.requests.recentActivity[0].fullName).toBe("Marie Curie");

    expect(stats.gallery).toEqual({ photosTotal: 2, eventsWithPhotos: 1 });
  });

  it("computes confirmation rate, future guests and breakdowns from confirmed reservations", async () => {
    const { eventService, reservationService, statsService } = await makeStatsService();

    const nowIso = "2026-05-17T00:00:00.000Z";

    // Upcoming event in 3 days
    const event = await eventService.create(
      eventPayload({ slug: "next-evening", starts_at: "2026-05-20T22:00:00.000Z" })
    );

    // 2 confirmed reservations on this event
    const r1 = await reservationService.create({
      full_name: "Alice",
      email: "alice@example.com",
      phone: "0601020304",
      guest_count: 4,
      event_id: event.id,
      table_type: "vip",
      occasion_type: "evjf",
      arrival_time: "23:00",
      source_locale: "fr",
      consent_rgpd: true
    });
    const r2 = await reservationService.create({
      full_name: "Bob",
      email: "bob@example.com",
      phone: "0601020305",
      guest_count: 6,
      event_id: event.id,
      table_type: "prestige",
      occasion_type: "anniversaire",
      arrival_time: "00:30",
      source_locale: "fr",
      consent_rgpd: true
    });
    await reservationService.confirm(r1.id);
    await reservationService.confirm(r2.id);

    // 1 refused
    const r3 = await reservationService.create({
      full_name: "Charlie",
      email: "charlie@example.com",
      phone: "0601020306",
      guest_count: 2,
      event_id: event.id,
      table_type: "classique",
      arrival_time: "23:00",
      source_locale: "fr",
      consent_rgpd: true
    });
    await reservationService.refuse(r3.id);

    const stats = await statsService.getStats(nowIso);

    // 2 confirmed out of 3 decided in the last 30d
    expect(stats.requests.confirmationRate30d).toBeCloseTo(2 / 3, 5);
    expect(stats.requests.reservationsConfirmed).toBe(2);
    expect(stats.requests.reservationsRefused).toBe(1);

    // 10 guests confirmed for an event in 3 days
    expect(stats.requests.guestsConfirmedNext7Days).toBe(10);
    expect(stats.requests.guestsConfirmedNext30Days).toBe(10);

    expect(stats.requests.avgGuestsPerConfirmedRes).toBe(5);
    expect(stats.requests.tableTypeBreakdown).toEqual({ classique: 0, prestige: 1, vip: 1 });
    expect(stats.requests.occasionBreakdown).toEqual({
      evg: 0,
      evjf: 1,
      anniversaire: 1,
      autre: 0
    });

    expect(stats.events.nextEvent).not.toBeNull();
    expect(stats.events.nextEvent?.confirmedCount).toBe(2);
    expect(stats.events.nextEvent?.totalGuestsConfirmed).toBe(10);
    expect(stats.events.nextEvent?.daysUntil).toBe(3);
  });
});
