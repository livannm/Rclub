import type { GalleryPhoto } from "@/lib/gallery/gallery-types";

export interface GalleryRepository {
  listByEventSlug(eventSlug: string): Promise<GalleryPhoto[]>;
  listEventSlugs(): Promise<string[]>;
}
