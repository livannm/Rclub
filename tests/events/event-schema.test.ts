import { describe, expect, it } from "vitest";
import { eventSchema } from "@/lib/events/event-schema";

const validPayload = {
  slug: "cash-out-2026",
  title_fr: "Cash Out",
  title_en: "Cash Out",
  description_fr: "Soiree premium",
  description_en: "Premium party",
  starts_at: "2099-06-01T20:00:00.000Z",
  ends_at: "2099-06-02T01:00:00.000Z",
  location: "Rclub Strasbourg",
  cover_image_url: "https://example.com/cover.jpg",
  hero_video_url: "https://example.com/hero.mp4",
  ticket_url: "https://example.com/tickets",
  is_published: true
};

describe("eventSchema", () => {
  it("accepts a valid payload", () => {
    expect(eventSchema.parse(validPayload)).toMatchObject(validPayload);
  });

  it("rejects duplicated invalid end date", () => {
    const parsed = eventSchema.safeParse({
      ...validPayload,
      ends_at: "2099-05-31T20:00:00.000Z"
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("date de fin");
    }
  });
});
