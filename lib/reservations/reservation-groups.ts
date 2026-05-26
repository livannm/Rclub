import type { ReservationRequest } from "@/lib/reservations/reservation-schema";

export type EveningGroup = {
  key: string;
  slug: string;
  eventId: string | null;
  label: string;
  date: Date | null;
  upcoming: boolean;
  confirmed: number;
  pending: number;
  refused: number;
  cancelled: number;
  totalGuestsConfirmed: number;
  reservations: ReservationRequest[];
};

type EventLookup = Record<string, { titleFr: string; startsAt: Date }>;

export function groupReservationsByEvening(
  reservations: ReservationRequest[],
  events: EventLookup
): EveningGroup[] {
  const now = new Date();
  const map = new Map<string, EveningGroup>();

  for (const r of reservations) {
    let key: string;
    let label: string;
    let date: Date | null = null;

    let eventId: string | null = null;
    if (r.event_id && events[r.event_id]) {
      const ev = events[r.event_id];
      key = `event:${r.event_id}`;
      label = ev.titleFr;
      date = ev.startsAt;
      eventId = r.event_id;
    } else if (r.date_requested) {
      key = `date:${r.date_requested}`;
      label = new Date(r.date_requested).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      date = new Date(r.date_requested);
    } else {
      key = "no-date";
      label = "Sans date précisée";
      date = null;
    }

    if (!map.has(key)) {
      map.set(key, {
        key,
        slug: key.replace(":", "_"),
        eventId,
        label,
        date,
        upcoming: date ? date >= now : false,
        confirmed: 0,
        pending: 0,
        refused: 0,
        cancelled: 0,
        totalGuestsConfirmed: 0,
        reservations: []
      });
    }

    const group = map.get(key)!;
    group.reservations.push(r);

    if (r.status === "confirmed") {
      group.confirmed++;
      group.totalGuestsConfirmed += r.guest_count;
    } else if (r.status === "refused") {
      group.refused++;
    } else if (r.status === "cancelled") {
      group.cancelled++;
    } else {
      group.pending++;
    }
  }

  return [...map.values()].sort((a, b) => {
    // No date → at the end
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    // Upcoming: ascending (sooner first); Past: descending (most recent first)
    if (a.upcoming && b.upcoming) return a.date.getTime() - b.date.getTime();
    if (!a.upcoming && !b.upcoming) return b.date.getTime() - a.date.getTime();
    // Upcoming before past
    return a.upcoming ? -1 : 1;
  });
}
