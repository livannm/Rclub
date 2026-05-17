import { describe, expect, it } from "vitest";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { EventService } from "@/lib/events/events-service";

describe("agenda ordering", () => {
  it("sorts upcoming published events by ascending date", async () => {
    const service = new EventService(new InMemoryEventRepository());

    await service.create({
      slug: "event-late",
      title_fr: "Evenement tardif",
      title_en: "Late event",
      description_fr: "Desc",
      description_en: "Desc",
      starts_at: "2099-08-03T20:00:00.000Z",
      ends_at: "2099-08-03T23:00:00.000Z",
      location: "Rclub Strasbourg",
      cover_image_url: "https://example.com/late.jpg",
      hero_video_url: "https://example.com/late.mp4",
      ticket_url: "https://example.com/late",
      is_published: true
    });

    await service.create({
      slug: "event-early",
      title_fr: "Evenement tot",
      title_en: "Early event",
      description_fr: "Desc",
      description_en: "Desc",
      starts_at: "2099-08-01T20:00:00.000Z",
      ends_at: "2099-08-01T23:00:00.000Z",
      location: "Rclub Strasbourg",
      cover_image_url: "https://example.com/early.jpg",
      hero_video_url: "https://example.com/early.mp4",
      ticket_url: "https://example.com/early",
      is_published: true
    });

    const events = await service.listPublishedUpcoming();
    expect(events[0]?.slug).toBe("event-early");
    expect(events[1]?.slug).toBe("event-late");
  });
});
