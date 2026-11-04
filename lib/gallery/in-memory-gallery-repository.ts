import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";
import { DEMO_GALLERY_PHOTOS, DEMO_EVENTS } from "@/lib/seed/demo-content";
import type { EventRepository } from "@/lib/events/event-repository";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { paginate } from "@/lib/utils/pagination";

export class InMemoryGalleryRepository implements GalleryRepository {
  private photos: GalleryPhoto[];

  constructor(
    initialPhotos: GalleryPhoto[] = DEMO_GALLERY_PHOTOS,
    private readonly events: Pick<EventRepository, "listAll"> = new InMemoryEventRepository(DEMO_EVENTS),
  ) {
    this.photos = [...initialPhotos];
  }

  async listAlbums(page: number, pageSize: number) {
    const withPhotos = new Set(this.photos.map(photo => photo.event_id));
    const events = (await this.events.listAll()).filter(event => event.is_published && withPhotos.has(event.id));
    events.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime() || a.id.localeCompare(b.id));
    return paginate(events, pageSize, page);
  }

  async listByEventSlugPage(eventSlug: string, page: number, pageSize: number) {
    const photos = this.photos.filter(photo => photo.event_slug === eventSlug)
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    return paginate(photos, pageSize, page);
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
