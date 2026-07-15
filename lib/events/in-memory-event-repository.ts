import type { ClubEvent, EventPayload } from "@/lib/events/event-schema";
import type { EventRepository } from "@/lib/events/event-repository";
import { eventMatchesClubEveningDate } from "@/lib/utils/club-date";

function sortByDateAsc(items: ClubEvent[]) {
  return [...items].sort(
    (first, second) => new Date(first.starts_at).getTime() - new Date(second.starts_at).getTime()
  );
}

export class InMemoryEventRepository implements EventRepository {
  private events: ClubEvent[];

  constructor(initialEvents: ClubEvent[] = []) {
    this.events = [...initialEvents];
  }

  async listAll() {
    return sortByDateAsc(this.events);
  }

  async listPublished() {
    return sortByDateAsc(this.events.filter((e) => e.is_published));
  }

  async listPublishedUpcoming(nowIso: string) {
    const now = new Date(nowIso).getTime();
    return sortByDateAsc(
      this.events.filter(
        (event) => event.is_published && new Date(event.starts_at).getTime() >= now
      )
    );
  }

  async findPublishedByDate(dateIso: string) {
    return sortByDateAsc(
      this.events.filter(
        (event) => event.is_published && eventMatchesClubEveningDate(event.starts_at, dateIso)
      )
    );
  }

  async findById(id: string) {
    return this.events.find((event) => event.id === id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.events.find((event) => event.slug === slug) ?? null;
  }

  async create(payload: EventPayload) {
    const now = new Date().toISOString();
    const created: ClubEvent = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now
    };

    this.events.push(created);
    return created;
  }

  async update(id: string, payload: EventPayload) {
    const eventIndex = this.events.findIndex((event) => event.id === id);
    if (eventIndex < 0) {
      return null;
    }

    const previous = this.events[eventIndex];
    const updated: ClubEvent = {
      ...payload,
      id,
      created_at: previous.created_at,
      updated_at: new Date().toISOString()
    };

    this.events[eventIndex] = updated;
    return updated;
  }

  async delete(id: string) {
    const sizeBefore = this.events.length;
    this.events = this.events.filter((event) => event.id !== id);
    return this.events.length !== sizeBefore;
  }
}
