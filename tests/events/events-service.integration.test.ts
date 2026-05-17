import { describe, expect, it } from "vitest";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { EventService, EventServiceError } from "@/lib/events/events-service";

function payload(slug: string) {
  return {
    slug,
    title_fr: `Titre ${slug}`,
    title_en: `Title ${slug}`,
    description_fr: "Description FR",
    description_en: "Description EN",
    starts_at: "2099-06-01T20:00:00.000Z",
    ends_at: "2099-06-02T01:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "https://example.com/cover.jpg",
    hero_video_url: "https://example.com/hero.mp4",
    ticket_url: "https://example.com/tickets",
    is_published: true
  };
}

describe("EventService", () => {
  it("creates, updates and deletes an event", async () => {
    const service = new EventService(new InMemoryEventRepository());

    const created = await service.create(payload("cash-out-2026"));
    expect(created.slug).toBe("cash-out-2026");

    const updated = await service.update(created.id, {
      ...payload("cash-out-2026"),
      title_fr: "Cash Out Updated"
    });
    expect(updated.title_fr).toBe("Cash Out Updated");

    await service.delete(created.id);
    await expect(service.update(created.id, payload("cash-out-2026"))).rejects.toBeInstanceOf(
      EventServiceError
    );
  });

  it("rejects duplicate slug", async () => {
    const service = new EventService(new InMemoryEventRepository());
    await service.create(payload("cash-out-2026"));

    await expect(service.create(payload("cash-out-2026"))).rejects.toMatchObject({
      code: "DUPLICATE_SLUG"
    });
  });

  it("returns only published upcoming events", async () => {
    const service = new EventService(new InMemoryEventRepository());
    await service.create(payload("published-event"));
    await service.create({
      ...payload("draft-event"),
      is_published: false
    });

    const upcoming = await service.listPublishedUpcoming();
    expect(upcoming.map((event) => event.slug)).toContain("published-event");
    expect(upcoming.map((event) => event.slug)).not.toContain("draft-event");
  });
});
