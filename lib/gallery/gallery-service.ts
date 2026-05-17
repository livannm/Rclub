import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { CreatePhotoPayload } from "@/lib/gallery/gallery-types";

export class GalleryService {
  constructor(private readonly repository: GalleryRepository) {}

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

  async deletePhoto(photoId: string): Promise<boolean> {
    return this.repository.deleteById(photoId);
  }

  async reorderPhoto(photoId: string, newSortOrder: number) {
    return this.repository.updateSortOrder(photoId, newSortOrder);
  }
}
