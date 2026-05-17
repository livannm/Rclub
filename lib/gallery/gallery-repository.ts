import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";

export interface GalleryRepository {
  listByEventSlug(eventSlug: string): Promise<GalleryPhoto[]>;
  listEventSlugs(): Promise<string[]>;
  listByEventId(eventId: string): Promise<GalleryPhoto[]>;
  create(payload: CreatePhotoPayload): Promise<GalleryPhoto>;
  deleteById(id: string): Promise<boolean>;
  updateSortOrder(id: string, sortOrder: number): Promise<GalleryPhoto | null>;
}
