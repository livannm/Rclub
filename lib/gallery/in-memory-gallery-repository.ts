import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";
import { DEMO_GALLERY_PHOTOS } from "@/lib/seed/demo-content";

export class InMemoryGalleryRepository implements GalleryRepository {
  private photos: GalleryPhoto[];

  constructor(initialPhotos: GalleryPhoto[] = DEMO_GALLERY_PHOTOS) {
    this.photos = [...initialPhotos];
  }

  async listByEventSlug(eventSlug: string): Promise<GalleryPhoto[]> {
    return this.photos
      .filter((photo) => photo.event_slug === eventSlug)
      .sort((a, b) => a.order - b.order);
  }

  async listEventSlugs(): Promise<string[]> {
    return [...new Set(this.photos.map((photo) => photo.event_slug))];
  }

  async listByEventId(eventId: string): Promise<GalleryPhoto[]> {
    return this.photos
      .filter((photo) => photo.event_id === eventId)
      .sort((a, b) => a.order - b.order);
  }

  async create(payload: CreatePhotoPayload): Promise<GalleryPhoto> {
    const photo: GalleryPhoto = {
      id: crypto.randomUUID(),
      event_id: payload.event_id,
      event_slug: payload.event_slug,
      image_url: payload.image_url,
      alt_fr: payload.alt_fr,
      alt_en: payload.alt_en,
      order: payload.order
    };
    this.photos.push(photo);
    return photo;
  }

  async deleteById(id: string): Promise<boolean> {
    const before = this.photos.length;
    this.photos = this.photos.filter((photo) => photo.id !== id);
    return this.photos.length !== before;
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<GalleryPhoto | null> {
    const index = this.photos.findIndex((photo) => photo.id === id);
    if (index < 0) return null;
    const updated: GalleryPhoto = { ...this.photos[index]!, order: sortOrder };
    this.photos[index] = updated;
    return updated;
  }
}
