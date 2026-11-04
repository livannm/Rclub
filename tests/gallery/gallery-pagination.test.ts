import { describe, expect, it } from "vitest";
import { GalleryService } from "@/lib/gallery/gallery-service";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { DEMO_EVENTS } from "@/lib/seed/demo-content";
import type { GalleryPhoto } from "@/lib/gallery/gallery-types";

const events = Array.from({ length: 8 }, (_, i) => ({
  ...DEMO_EVENTS[0], id: `event-${i}`, slug: `album-${i}`,
  starts_at: `2026-06-${String(i + 1).padStart(2, "0")}T21:00:00.000Z`,
  is_published: i !== 7,
}));
const photos: GalleryPhoto[] = Array.from({ length: 8 }, (_, i) => ({
  id: `photo-${i}`, event_id: `event-${i}`, event_slug: `album-${i}`,
  image_url: "/photo.jpg", alt_fr: "Photo", alt_en: "Photo", order: 1,
}));

describe("gallery pagination", () => {
  it("sorts published albums by event date and splits them into pages of five", async () => {
    const service = new GalleryService(new InMemoryGalleryRepository(photos, new InMemoryEventRepository(events)));
    const result = await service.listAlbums(1);
    expect(result.total).toBe(7);
    expect(result.items.map(e => e.slug)).toEqual(["album-6", "album-5", "album-4", "album-3", "album-2"]);
    expect((await service.listAlbums(2)).items.map(e => e.slug)).toEqual(["album-1", "album-0"]);
  });

  it("keeps manual photo order with stable ties across pages of 24", async () => {
    const albumPhotos = Array.from({ length: 49 }, (_, i) => ({
      ...photos[0], id: `photo-${String(i).padStart(3, "0")}`, order: Math.floor(i / 2),
    })).reverse();
    const service = new GalleryService(new InMemoryGalleryRepository(albumPhotos));
    const first = await service.listEventPhotosPage("album-0", 1);
    const second = await service.listEventPhotosPage("album-0", 2);
    const last = await service.listEventPhotosPage("album-0", 3);
    expect(first.items).toHaveLength(24);
    expect(second.items).toHaveLength(24);
    expect(last.items).toHaveLength(1);
    expect(first.items[23].id).toBe("photo-023");
    expect(second.items[0].id).toBe("photo-024");
    expect(new Set([...first.items, ...second.items, ...last.items].map(p => p.id)).size).toBe(49);
    expect((await service.listEventPhotosPage("album-0", 99)).page).toBe(3);
    expect((await service.listEventPhotosPage("missing", 1)).total).toBe(0);
  });
});
