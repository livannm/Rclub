import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";

const CASH_OUT_SEED_EVENT_ID = "cash-out-seed-event-id";

const seedPhotos: GalleryPhoto[] = [
  {
    id: "cash-out-1",
    event_id: CASH_OUT_SEED_EVENT_ID,
    event_slug: "cash-out",
    image_url: "/media/cash-out-01.jpg",
    alt_fr: "Photo Cash Out - piste illuminee",
    alt_en: "Cash Out photo - lit dancefloor",
    order: 1
  },
  {
    id: "cash-out-2",
    event_id: CASH_OUT_SEED_EVENT_ID,
    event_slug: "cash-out",
    image_url: "/media/cash-out-02.jpg",
    alt_fr: "Photo Cash Out - public en fete",
    alt_en: "Cash Out photo - crowd celebrating",
    order: 2
  },
  {
    id: "cash-out-3",
    event_id: CASH_OUT_SEED_EVENT_ID,
    event_slug: "cash-out",
    image_url: "/media/cash-out-03.jpg",
    alt_fr: "Photo Cash Out - DJ set",
    alt_en: "Cash Out photo - DJ set",
    order: 3
  }
];

export class InMemoryGalleryRepository implements GalleryRepository {
  private photos: GalleryPhoto[];

  constructor(initialPhotos: GalleryPhoto[] = seedPhotos) {
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
