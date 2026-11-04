import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { CreatePhotoPayload } from "@/lib/gallery/gallery-types";
import { ALBUM_PAGE_SIZE, PHOTO_PAGE_SIZE, parsePage } from "@/lib/utils/pagination";

export class GalleryService {
  constructor(private readonly repository: GalleryRepository) {}

  async listAlbums(page = 1) {
    return this.repository.listAlbums(parsePage(page), ALBUM_PAGE_SIZE);
  }

  async listEventPhotosPage(eventSlug: string, page = 1) {
    return this.repository.listByEventSlugPage(eventSlug, parsePage(page), PHOTO_PAGE_SIZE);
  }

  async listEventPhotos(eventSlug: string) {
    return this.repository.listByEventSlug(eventSlug);
  }

  async listEventSlugs() {
    return this.repository.listEventSlugs();
  }

  async getPhotosForEvent(eventId: string) {
    return this.repository.listByEventId(eventId);
  }

  async addPhoto(payload: CreatePhotoPayload) {
    return this.repository.create(payload);
  }

  async addPhotos(payloads: CreatePhotoPayload[]) {
    const created = [];
    for (const payload of payloads) {
      created.push(await this.repository.create(payload));
    }
    return created;
  }

  async deletePhoto(photoId: string): Promise<boolean> {
    return this.repository.deleteById(photoId);
  }

  async reorderPhoto(photoId: string, newSortOrder: number) {
    return this.repository.updateSortOrder(photoId, newSortOrder);
  }
}
