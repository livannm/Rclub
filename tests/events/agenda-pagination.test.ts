import { describe, expect, it } from "vitest";
import { EventService } from "@/lib/events/events-service";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { DEMO_EVENTS } from "@/lib/seed/demo-content";

const events = Array.from({ length: 12 }, (_, i) => ({
  ...DEMO_EVENTS[0], id: `event-${String(i).padStart(2, "0")}`, slug: `event-${i}`,
  starts_at: `2026-06-${String(i + 1).padStart(2, "0")}T21:00:00.000Z`,
}));
const service = new EventService(new InMemoryEventRepository([
  ...events.reverse(), { ...events[0], id: "draft", is_published: false },
]));
const now = new Date("2026-06-06T12:00:00Z");

describe("public agenda pagination", () => {
  it("includes past AND future events, newest first, five per page", async () => {
    const first = await service.listAgenda({ showPast: true, page: 1, now });
    const second = await service.listAgenda({ showPast: true, page: 2, now });
    expect(first.total).toBe(12);
    expect(first.totalPages).toBe(3);
    expect(first.items.map(e => e.slug)).toEqual(["event-11", "event-10", "event-9", "event-8", "event-7"]);
    expect(second.items.map(e => e.slug)).toEqual(["event-6", "event-5", "event-4", "event-3", "event-2"]);
  });

  it("keeps the upcoming-only view unpaginated and nearest first", async () => {
    const result = await service.listAgenda({ showPast: false, page: 9, now });
    expect(result.items.map(e => e.slug)).toEqual(["event-5", "event-6", "event-7", "event-8", "event-9", "event-10", "event-11"]);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("clamps out-of-range pages and handles an empty filter", async () => {
    expect((await service.listAgenda({ showPast: true, page: 999, now })).items).toHaveLength(2);
    expect((await service.listAgenda({ showPast: true, year: 2030, now })).items).toEqual([]);
  });

  it("uses the Paris club evening for month filters, including after midnight", async () => {
    const local = new EventService(new InMemoryEventRepository([
      { ...DEMO_EVENTS[0], id: "a", starts_at: "2026-06-01T00:30:00.000Z" },
      { ...DEMO_EVENTS[0], id: "b", starts_at: "2026-06-01T21:00:00.000Z" },
    ]));
    const may = await local.listAgenda({ showPast: true, year: 2026, month: 5, now });
    expect(may.items.map(e => e.id)).toEqual(["a"]);
    const june = await local.listAgenda({ showPast: true, year: 2026, month: 6, now });
    expect(june.items.map(e => e.id)).toEqual(["b"]);
  });
});
