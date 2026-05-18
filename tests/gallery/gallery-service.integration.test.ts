import { describe, expect, it } from "vitest";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";

describe("GalleryService", () => {
  it("returns Legend R photos sorted by order", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository());
    const photos = await service.listEventPhotos("legend-r");

    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0]?.event_slug).toBe("legend-r");
    expect(photos[0]?.order).toBe(1);
  });

  it("returns empty list for unknown event", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository());
    const photos = await service.listEventPhotos("unknown-event");
    expect(photos).toEqual([]);
  });
});
