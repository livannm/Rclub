import { describe, expect, it } from "vitest";
import { resolveEveningGroup } from "@/lib/reservations/reservation-groups";

const eventId = "11111111-1111-4111-8111-111111111111";

describe("resolveEveningGroup", () => {
  it("returns an empty group for an event that has no reservations", () => {
    const group = resolveEveningGroup(`event_${eventId}`, [], {
      [eventId]: {
        titleFr: "Soirée vide",
        startsAt: new Date("2099-06-01T22:00:00.000Z"),
        startsAtIso: "2099-06-01T22:00:00.000Z",
      },
    });

    expect(group).toMatchObject({
      slug: `event_${eventId}`,
      eventId,
      label: "Soirée vide",
      upcoming: true,
      confirmed: 0,
      pending: 0,
      refused: 0,
      cancelled: 0,
      totalGuestsConfirmed: 0,
      reservations: [],
    });
  });

  it("keeps the group built from existing reservations", () => {
    const existing = {
      key: `event:${eventId}`,
      slug: `event_${eventId}`,
      eventId,
      label: "Soirée pleine",
      date: new Date("2099-06-01T22:00:00.000Z"),
      eveningDateIso: "2099-06-01",
      upcoming: true,
      confirmed: 1,
      pending: 0,
      refused: 0,
      cancelled: 0,
      totalGuestsConfirmed: 4,
      reservations: [],
    };

    const group = resolveEveningGroup(`event_${eventId}`, [existing], {
      [eventId]: {
        titleFr: "Soirée vide",
        startsAt: new Date("2099-06-01T22:00:00.000Z"),
        startsAtIso: "2099-06-01T22:00:00.000Z",
      },
    });

    expect(group).toBe(existing);
  });

  it("returns null when the event does not exist", () => {
    expect(resolveEveningGroup(`event_${eventId}`, [], {})).toBeNull();
  });
});
