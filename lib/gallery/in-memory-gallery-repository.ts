import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { GalleryPhoto } from "@/lib/gallery/gallery-types";

const seedPhotos: GalleryPhoto[] = [
  {
    id: "cash-out-1",
    event_slug: "cash-out",
    image_url: "/media/cash-out-01.jpg",
    alt_fr: "Photo Cash Out - piste illuminee",
    alt_en: "Cash Out photo - lit dancefloor",
    order: 1
  },
  {
    id: "cash-out-2",
    event_slug: "cash-out",
    image_url: "/media/cash-out-02.jpg",
    alt_fr: "Photo Cash Out - public en fete",
    alt_en: "Cash Out photo - crowd celebrating",
    order: 2
  },
  {
    id: "cash-out-3",
    event_slug: "cash-out",
    image_url: "/media/cash-out-03.jpg",
    alt_fr: "Photo Cash Out - DJ set",
    alt_en: "Cash Out photo - DJ set",
    order: 3
  }
];

export class InMemoryGalleryRepository implements GalleryRepository {
  constructor(private readonly photos: GalleryPhoto[] = seedPhotos) {}

  async listByEventSlug(eventSlug: string) {
    return this.photos
      .filter((photo) => photo.event_slug === eventSlug)
      .sort((first, second) => first.order - second.order);
  }
}
