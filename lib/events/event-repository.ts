import type { ClubEvent, EventPayload } from "@/lib/events/event-schema";
import type { Paginated } from "@/lib/utils/pagination";

export type EventListQuery = {
  startsAtFrom?: string;
  startsAtTo?: string;
  descending: boolean;
  page: number;
  pageSize?: number;
};

export interface EventRepository {
  listPublishedPage(query: EventListQuery): Promise<Paginated<ClubEvent>>;
  listPublishedDates(): Promise<string[]>;
  listAll(): Promise<ClubEvent[]>;
  listPublished(): Promise<ClubEvent[]>;
  listPublishedUpcoming(nowIso: string): Promise<ClubEvent[]>;
  findPublishedByDate(dateIso: string): Promise<ClubEvent[]>;
  findById(id: string): Promise<ClubEvent | null>;
  findBySlug(slug: string): Promise<ClubEvent | null>;
  create(payload: EventPayload): Promise<ClubEvent>;
  update(id: string, payload: EventPayload): Promise<ClubEvent | null>;
  delete(id: string): Promise<boolean>;
}
