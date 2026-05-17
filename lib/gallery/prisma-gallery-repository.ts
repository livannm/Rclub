import { PrismaClient } from "@prisma/client";
import type { GalleryRepository } from "@/lib/gallery/gallery-repository";
import type { GalleryPhoto, CreatePhotoPayload } from "@/lib/gallery/gallery-types";

function toGalleryPhoto(
  media: {
    id: string;
    eventId: string;
    event: { slug: string };
    url: string;
    captionFr: string | null;
    captionEn: string | null;
    sortOrder: number;
  }
): GalleryPhoto {
  return {
    id: media.id,
    event_id: media.eventId,
    event_slug: media.event.slug,
    image_url: media.url,
    alt_fr: media.captionFr ?? "",
    alt_en: media.captionEn ?? "",
    order: media.sortOrder
  };
}

export class PrismaGalleryRepository implements GalleryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByEventSlug(eventSlug: string): Promise<GalleryPhoto[]> {
    const medias = await this.prisma.eventMedia.findMany({
      where: { event: { slug: eventSlug }, type: "photo" },
      include: { event: { select: { slug: true } } },
      orderBy: { sortOrder: "asc" }
    });
    return medias.map(toGalleryPhoto);
  }

  async listEventSlugs(): Promise<string[]> {
    const events = await this.prisma.event.findMany({
      where: { medias: { some: { type: "photo" } } },
      select: { slug: true }
    });
    return events.map((e) => e.slug);
  }

  async listByEventId(eventId: string): Promise<GalleryPhoto[]> {
    const medias = await this.prisma.eventMedia.findMany({
      where: { eventId, type: "photo" },
      include: { event: { select: { slug: true } } },
      orderBy: { sortOrder: "asc" }
    });
    return medias.map(toGalleryPhoto);
  }

  async create(payload: CreatePhotoPayload): Promise<GalleryPhoto> {
    const media = await this.prisma.eventMedia.create({
      data: {
        eventId: payload.event_id,
        url: payload.image_url,
        captionFr: payload.alt_fr || null,
        captionEn: payload.alt_en || null,
        sortOrder: payload.order,
        type: "photo"
      },
      include: { event: { select: { slug: true } } }
    });
    return toGalleryPhoto(media);
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.prisma.eventMedia.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<GalleryPhoto | null> {
    try {
      const media = await this.prisma.eventMedia.update({
        where: { id },
        data: { sortOrder },
        include: { event: { select: { slug: true } } }
      });
      return toGalleryPhoto(media);
    } catch {
      return null;
    }
  }
}
