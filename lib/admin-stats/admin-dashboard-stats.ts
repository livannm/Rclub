import type { EventService } from "@/lib/events/events-service";
import type { GalleryService } from "@/lib/gallery/gallery-service";
import type { PrivatizationService } from "@/lib/privatizations/privatization-service";
import type { ReservationService } from "@/lib/reservations/reservation-service";
import type { ReservationRequest, ReservationStatus } from "@/lib/reservations/reservation-schema";
import type { ClubEvent } from "@/lib/events/event-schema";

export type UpcomingEventSummary = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  startsAtIso: string;
  coverImageUrl: string;
  daysUntil: number;
  confirmedCount: number;
  pendingCount: number;
  totalGuestsConfirmed: number;
};

export type RecentReservation = {
  id: string;
  fullName: string;
  guestCount: number;
  status: ReservationStatus;
  createdAtIso: string;
  eventTitleFr: string | null;
  dateRequested: string | null;
};

export type WeeklyTrendPoint = {
  weekStartIso: string;
  count: number;
};

export type AdminDashboardStats = {
  events: {
    total: number;
    published: number;
    upcomingPublished: number;
    nextEvent: UpcomingEventSummary | null;
    upcomingPlanning: UpcomingEventSummary[];
  };
  requests: {
    reservationsTotal: number;
    reservationsNew: number;
    reservationsConfirmed: number;
    reservationsRefused: number;
    reservationsCancelled: number;
    privatizationsTotal: number;
    privatizationsNew: number;
    confirmationRate30d: number;
    cancellationRate90d: number;
    guestsConfirmedNext7Days: number;
    guestsConfirmedNext30Days: number;
    avgGuestsPerConfirmedRes: number;
    tableTypeBreakdown: { classique: number; prestige: number; vip: number };
    occasionBreakdown: { evg: number; evjf: number; anniversaire: number; autre: number };
    weeklyTrend: WeeklyTrendPoint[];
    recentActivity: RecentReservation[];
  };
  gallery: {
    photosTotal: number;
    eventsWithPhotos: number;
  };
};

type AdminDashboardStatsServices = {
  eventService: EventService;
  reservationService: ReservationService;
  privatizationService: PrivatizationService;
  galleryService: GalleryService;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function startOfWeekUtc(d: Date): Date {
  const day = startOfDayUtc(d);
  const dow = day.getUTCDay(); // 0 = Sunday
  const diffToMonday = (dow + 6) % 7;
  return new Date(day.getTime() - diffToMonday * MS_PER_DAY);
}

function reservationEventDate(reservation: ReservationRequest, event?: ClubEvent): Date | null {
  if (event) return new Date(event.starts_at);
  if (reservation.date_requested) return new Date(reservation.date_requested);
  return null;
}

export class AdminDashboardStatsService {
  constructor(private readonly services: AdminDashboardStatsServices) {}

  async getStats(nowIso = new Date().toISOString()): Promise<AdminDashboardStats> {
    const [events, reservations, privatizations] = await Promise.all([
      this.services.eventService.listAll(),
      this.services.reservationService.listAll(),
      this.services.privatizationService.listAll()
    ]);

    const photosByEvent = await Promise.all(
      events.map(async (event) => this.services.galleryService.getPhotosForEvent(event.id))
    );

    const now = new Date(nowIso);
    const nowMs = now.getTime();
    const publishedEvents = events.filter((event) => event.is_published);
    const eventById = new Map(events.map((e) => [e.id, e] as const));

    const upcomingPublishedSorted = publishedEvents
      .filter((event) => new Date(event.starts_at).getTime() >= nowMs)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

    const todayUtcMs = startOfDayUtc(now).getTime();
    const upcomingPlanning = upcomingPublishedSorted
      .slice(0, 3)
      .map((event) => this.toUpcomingSummary(event, reservations, todayUtcMs));

    // ── Reservation aggregates ──
    const newRes = reservations.filter((r) => r.status === "new");
    const confirmedRes = reservations.filter((r) => r.status === "confirmed");
    const refusedRes = reservations.filter((r) => r.status === "refused");
    const cancelledRes = reservations.filter((r) => r.status === "cancelled");

    // Decision rates (based on decided reservations in the window)
    const cutoff30d = nowMs - 30 * MS_PER_DAY;
    const cutoff90d = nowMs - 90 * MS_PER_DAY;
    const decided30d = reservations.filter(
      (r) =>
        new Date(r.created_at).getTime() >= cutoff30d &&
        (r.status === "confirmed" || r.status === "refused")
    );
    const confirmedIn30dDecisions = decided30d.filter((r) => r.status === "confirmed").length;
    const confirmationRate30d =
      decided30d.length > 0 ? confirmedIn30dDecisions / decided30d.length : 0;

    const confirmedWithin90d = reservations.filter(
      (r) =>
        r.confirmed_at &&
        new Date(r.confirmed_at).getTime() >= cutoff90d
    );
    const cancelledWithin90d = reservations.filter(
      (r) =>
        r.status === "cancelled" &&
        r.cancelled_at &&
        new Date(r.cancelled_at).getTime() >= cutoff90d
    );
    const cancellationRate90d =
      confirmedWithin90d.length > 0
        ? cancelledWithin90d.length / confirmedWithin90d.length
        : 0;

    // Future guests
    const in7d = nowMs + 7 * MS_PER_DAY;
    const in30d = nowMs + 30 * MS_PER_DAY;
    let guestsConfirmedNext7Days = 0;
    let guestsConfirmedNext30Days = 0;
    for (const r of confirmedRes) {
      const date = reservationEventDate(r, r.event_id ? eventById.get(r.event_id) : undefined);
      if (!date) continue;
      const t = date.getTime();
      if (t < nowMs) continue;
      if (t <= in7d) guestsConfirmedNext7Days += r.guest_count;
      if (t <= in30d) guestsConfirmedNext30Days += r.guest_count;
    }

    const avgGuestsPerConfirmedRes =
      confirmedRes.length > 0
        ? confirmedRes.reduce((sum, r) => sum + r.guest_count, 0) / confirmedRes.length
        : 0;

    // Breakdowns (across all confirmed reservations)
    const tableTypeBreakdown = { classique: 0, prestige: 0, vip: 0 };
    const occasionBreakdown = { evg: 0, evjf: 0, anniversaire: 0, autre: 0 };
    for (const r of confirmedRes) {
      if (r.table_type) tableTypeBreakdown[r.table_type]++;
      if (r.occasion_type) occasionBreakdown[r.occasion_type]++;
    }

    // Weekly trend (last 4 weeks of incoming reservations)
    const currentWeekStart = startOfWeekUtc(now);
    const weeklyTrend: WeeklyTrendPoint[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(currentWeekStart.getTime() - i * 7 * MS_PER_DAY);
      const weekEnd = new Date(weekStart.getTime() + 7 * MS_PER_DAY);
      const count = reservations.filter((r) => {
        const created = new Date(r.created_at).getTime();
        return created >= weekStart.getTime() && created < weekEnd.getTime();
      }).length;
      weeklyTrend.push({ weekStartIso: weekStart.toISOString(), count });
    }

    // Recent activity (last 5 reservations by created_at desc)
    const recentActivity: RecentReservation[] = [...reservations]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        fullName: r.full_name,
        guestCount: r.guest_count,
        status: r.status,
        createdAtIso: r.created_at,
        eventTitleFr: r.event_id ? eventById.get(r.event_id)?.title_fr ?? null : null,
        dateRequested: r.date_requested ?? null
      }));

    return {
      events: {
        total: events.length,
        published: publishedEvents.length,
        upcomingPublished: upcomingPublishedSorted.length,
        nextEvent: upcomingPlanning[0] ?? null,
        upcomingPlanning
      },
      requests: {
        reservationsTotal: reservations.length,
        reservationsNew: newRes.length,
        reservationsConfirmed: confirmedRes.length,
        reservationsRefused: refusedRes.length,
        reservationsCancelled: cancelledRes.length,
        privatizationsTotal: privatizations.length,
        privatizationsNew: privatizations.filter((p) => p.status === "new").length,
        confirmationRate30d,
        cancellationRate90d,
        guestsConfirmedNext7Days,
        guestsConfirmedNext30Days,
        avgGuestsPerConfirmedRes,
        tableTypeBreakdown,
        occasionBreakdown,
        weeklyTrend,
        recentActivity
      },
      gallery: {
        photosTotal: photosByEvent.reduce((total, photos) => total + photos.length, 0),
        eventsWithPhotos: photosByEvent.filter((photos) => photos.length > 0).length
      }
    };
  }

  private toUpcomingSummary(
    event: ClubEvent,
    reservations: ReservationRequest[],
    todayUtcMs: number
  ): UpcomingEventSummary {
    const eventRes = reservations.filter((r) => r.event_id === event.id);
    const confirmed = eventRes.filter((r) => r.status === "confirmed");
    const pending = eventRes.filter((r) => r.status === "new").length;
    const totalGuestsConfirmed = confirmed.reduce((sum, r) => sum + r.guest_count, 0);
    const eventDayUtcMs = startOfDayUtc(new Date(event.starts_at)).getTime();
    const daysUntil = Math.max(0, Math.round((eventDayUtcMs - todayUtcMs) / MS_PER_DAY));

    return {
      id: event.id,
      slug: event.slug,
      titleFr: event.title_fr,
      titleEn: event.title_en,
      startsAtIso: event.starts_at,
      coverImageUrl: event.cover_image_url,
      daysUntil,
      confirmedCount: confirmed.length,
      pendingCount: pending,
      totalGuestsConfirmed
    };
  }
}
