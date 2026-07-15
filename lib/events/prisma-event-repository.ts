import type { Prisma, Event as PrismaEvent } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type { ClubEvent, EventPayload } from "@/lib/events/event-schema";
import type { EventRepository } from "@/lib/events/event-repository";
import { eventMatchesClubEveningDate } from "@/lib/utils/club-date";

function sortByDateAsc(items: ClubEvent[]) {
  return [...items].sort(
    (first, second) => new Date(first.starts_at).getTime() - new Date(second.starts_at).getTime()
  );
}

function toClubEvent(event: PrismaEvent): ClubEvent {
  return {
    id: event.id,
    slug: event.slug,
    title_fr: event.titleFr,
    title_en: event.titleEn,
    description_fr: event.descriptionFr,
    description_en: event.descriptionEn,
    starts_at: event.startsAt.toISOString(),
    ends_at: event.endsAt?.toISOString(),
    location: event.location,
    cover_image_url: event.coverImageUrl,
    hero_video_url: event.heroVideoUrl ?? undefined,
    ticket_url: event.ticketUrl ?? undefined,
    is_published: event.isPublished,
    created_at: event.createdAt.toISOString(),
    updated_at: event.updatedAt.toISOString()
  };
}

function toCreateData(payload: EventPayload): Prisma.EventCreateInput {
  return {
    slug: payload.slug,
    titleFr: payload.title_fr,
    titleEn: payload.title_en,
    descriptionFr: payload.description_fr,
    descriptionEn: payload.description_en,
    startsAt: new Date(payload.starts_at),
    endsAt: payload.ends_at ? new Date(payload.ends_at) : null,
    location: payload.location,
    coverImageUrl: payload.cover_image_url,
    heroVideoUrl: payload.hero_video_url ?? null,
    ticketUrl: payload.ticket_url ?? null,
    isPublished: payload.is_published
  };
}

function toUpdateData(payload: EventPayload): Prisma.EventUpdateInput {
  return {
    slug: payload.slug,
    titleFr: payload.title_fr,
    titleEn: payload.title_en,
    descriptionFr: payload.description_fr,
    descriptionEn: payload.description_en,
    startsAt: new Date(payload.starts_at),
    endsAt: payload.ends_at ? new Date(payload.ends_at) : null,
    location: payload.location,
    coverImageUrl: payload.cover_image_url,
    heroVideoUrl: payload.hero_video_url ?? null,
    ticketUrl: payload.ticket_url ?? null,
    isPublished: payload.is_published
  };
}

export class PrismaEventRepository implements EventRepository {
  constructor(private readonly db: PrismaClient) {}

  async listAll() {
    const events = await this.db.event.findMany();
    return sortByDateAsc(events.map(toClubEvent));
  }

  async listPublished() {
    const events = await this.db.event.findMany({ where: { isPublished: true } });
    return sortByDateAsc(events.map(toClubEvent));
  }

  async listPublishedUpcoming(nowIso: string) {
    const now = new Date(nowIso);
    const events = await this.db.event.findMany({
      where: {
        isPublished: true,
        startsAt: { gte: now }
      }
    });
    return sortByDateAsc(events.map(toClubEvent));
  }

  async findPublishedByDate(dateIso: string) {
    const [year, month, day] = dateIso.split("-").map(Number);
    const searchStart = new Date(Date.UTC(year, month - 1, day - 1));
    const searchEnd = new Date(Date.UTC(year, month - 1, day + 2));
    const events = await this.db.event.findMany({
      where: {
        isPublished: true,
        startsAt: { gte: searchStart, lt: searchEnd }
      }
    });
    return sortByDateAsc(
      events
        .map(toClubEvent)
        .filter((event) => eventMatchesClubEveningDate(event.starts_at, dateIso))
    );
  }

  async findById(id: string) {
    const event = await this.db.event.findUnique({ where: { id } });
    return event ? toClubEvent(event) : null;
  }

  async findBySlug(slug: string) {
    const event = await this.db.event.findUnique({ where: { slug } });
    return event ? toClubEvent(event) : null;
  }

  async create(payload: EventPayload) {
    const event = await this.db.event.create({ data: toCreateData(payload) });
    return toClubEvent(event);
  }

  async update(id: string, payload: EventPayload) {
    try {
      const event = await this.db.event.update({
        where: { id },
        data: toUpdateData(payload)
      });
      return toClubEvent(event);
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    try {
      await this.db.event.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
