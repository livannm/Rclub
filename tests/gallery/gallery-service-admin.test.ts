import { describe, expect, it } from "vitest";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";

const TEST_EVENT_ID = "test-event-id-001";
const TEST_EVENT_SLUG = "test-event";

function makeService() {
  return new GalleryService(new InMemoryGalleryRepository([]));
}

function photoPayload(overrides: Partial<Parameters<GalleryService["addPhoto"]>[0]> = {}) {
  return {
    event_id: TEST_EVENT_ID,
    event_slug: TEST_EVENT_SLUG,
    image_url: "https://example.com/photo.jpg",
    alt_fr: "Photo FR",
    alt_en: "Photo EN",
    order: 1,
    ...overrides
  };
}

describe("GalleryService – admin CRUD", () => {
  describe("getPhotosForEvent", () => {
    it("returns empty list for event with no photos", async () => {
      const service = makeService();
      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos).toEqual([]);
    });

    it("returns only photos for the requested event", async () => {
      const service = makeService();
      await service.addPhoto(photoPayload({ event_id: "other-event", event_slug: "other" }));
      await service.addPhoto(photoPayload({ order: 1 }));
      await service.addPhoto(photoPayload({ order: 2 }));

      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos).toHaveLength(2);
      expect(photos.every((p) => p.event_id === TEST_EVENT_ID)).toBe(true);
    });

    it("returns photos sorted by sort_order ascending", async () => {
      const service = makeService();
      await service.addPhoto(photoPayload({ order: 3 }));
      await service.addPhoto(photoPayload({ order: 1 }));
      await service.addPhoto(photoPayload({ order: 2 }));

      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos.map((p) => p.order)).toEqual([1, 2, 3]);
    });
  });

  describe("addPhoto", () => {
    it("adds a photo and returns it with an id", async () => {
      const service = makeService();
      const photo = await service.addPhoto(photoPayload());

      expect(photo.id).toBeDefined();
      expect(photo.event_id).toBe(TEST_EVENT_ID);
      expect(photo.image_url).toBe("https://example.com/photo.jpg");
      expect(photo.alt_fr).toBe("Photo FR");
      expect(photo.order).toBe(1);
    });

    it("persists the photo so it can be retrieved", async () => {
      const service = makeService();
      const created = await service.addPhoto(photoPayload());

      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos.find((p) => p.id === created.id)).toBeDefined();
    });
  });

  describe("addPhotos", () => {
    it("adds multiple photos in one call", async () => {
      const service = makeService();
      const created = await service.addPhotos([
        photoPayload({ image_url: "https://example.com/a.jpg", order: 1 }),
        photoPayload({ image_url: "https://example.com/b.jpg", order: 2 })
      ]);

      expect(created).toHaveLength(2);
      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos).toHaveLength(2);
    });
  });

  describe("deletePhoto", () => {
    it("deletes an existing photo and returns true", async () => {
      const service = makeService();
      const photo = await service.addPhoto(photoPayload());

      const deleted = await service.deletePhoto(photo.id);
      expect(deleted).toBe(true);

      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos.find((p) => p.id === photo.id)).toBeUndefined();
    });

    it("returns false when photo does not exist", async () => {
      const service = makeService();
      const result = await service.deletePhoto("non-existent-id");
      expect(result).toBe(false);
    });
  });

  describe("reorderPhoto", () => {
    it("updates the sort_order of a photo", async () => {
      const service = makeService();
      const photo = await service.addPhoto(photoPayload({ order: 1 }));

      const updated = await service.reorderPhoto(photo.id, 5);
      expect(updated?.order).toBe(5);
    });

    it("returns null when photo does not exist", async () => {
      const service = makeService();
      const result = await service.reorderPhoto("non-existent-id", 1);
      expect(result).toBeNull();
    });

    it("reflects updated order in subsequent queries", async () => {
      const service = makeService();
      const photoA = await service.addPhoto(photoPayload({ order: 1 }));
      const photoB = await service.addPhoto(photoPayload({ order: 2 }));

      await service.reorderPhoto(photoA.id, 10);

      const photos = await service.getPhotosForEvent(TEST_EVENT_ID);
      expect(photos[0]!.id).toBe(photoB.id);
      expect(photos[1]!.id).toBe(photoA.id);
    });
  });
});

describe("GalleryService – public gallery (existing behaviour)", () => {
  it("listEventPhotos returns photos sorted by order for known slug", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository());
    const photos = await service.listEventPhotos("legend-r");

    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0]?.event_slug).toBe("legend-r");
    expect(photos[0]?.order).toBe(1);
  });

  it("listEventPhotos returns empty list for unknown slug", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository());
    const photos = await service.listEventPhotos("unknown-event");
    expect(photos).toEqual([]);
  });

  it("listEventSlugs returns slugs that have photos", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository());
    const slugs = await service.listEventSlugs();
    expect(slugs).toContain("legend-r");
  });
});
