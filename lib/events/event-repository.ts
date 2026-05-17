import type { ClubEvent, EventPayload } from "@/lib/events/event-schema";

export interface EventRepository {
  listAll(): Promise<ClubEvent[]>;
  listPublishedUpcoming(nowIso: string): Promise<ClubEvent[]>;
  findById(id: string): Promise<ClubEvent | null>;
  findBySlug(slug: string): Promise<ClubEvent | null>;
  create(payload: EventPayload): Promise<ClubEvent>;
  update(id: string, payload: EventPayload): Promise<ClubEvent | null>;
  delete(id: string): Promise<boolean>;
}
