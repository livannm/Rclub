import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";
import type { ClubEvent } from "@/lib/events/event-schema";
import type { Paginated } from "@/lib/utils/pagination";

export interface GalleryRepository {
  listAlbums(page: number, pageSize: number): Promise<Paginated<ClubEvent>>;
  listByEventSlugPage(eventSlug: string, page: number, pageSize: number): Promise<Paginated<GalleryPhoto>>;
  listByEventSlug(eventSlug: string): Promise<GalleryPhoto[]>;
  listEventSlugs(): Promise<string[]>;
  listByEventId(eventId: string): Promise<GalleryPhoto[]>;
  create(payload: CreatePhotoPayload): Promise<GalleryPhoto>;
  deleteById(id: string): Promise<boolean>;
  updateSortOrder(id: string, sortOrder: number): Promise<GalleryPhoto | null>;
}
