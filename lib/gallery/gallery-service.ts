import type { GalleryRepository } from "@/lib/gallery/gallery-repository";

export class GalleryService {
  constructor(private readonly repository: GalleryRepository) {}

  async listEventPhotos(eventSlug: string) {
    return this.repository.listByEventSlug(eventSlug);
  }
}
