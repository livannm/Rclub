import { ZodError } from "zod";
import { eventSchema, type ClubEvent, type EventPayload } from "@/lib/events/event-schema";
import type { EventRepository } from "@/lib/events/event-repository";

export type EventServiceErrorCode = "VALIDATION_ERROR" | "DUPLICATE_SLUG" | "NOT_FOUND";

export class EventServiceError extends Error {
  constructor(
    public readonly code: EventServiceErrorCode,
    message: string
  ) {
    super(message);
  }
}

export class EventService {
  constructor(private readonly repository: EventRepository) {}

  async listAll() {
    return this.repository.listAll();
  }

  async listPublished() {
    return this.repository.listPublished();
  }

  async listPublishedUpcoming() {
    return this.repository.listPublishedUpcoming(new Date().toISOString());
  }

  async findPublishedByDate(dateIso: string) {
    return this.repository.findPublishedByDate(dateIso);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async create(input: EventPayload): Promise<ClubEvent> {
    const payload = this.validatePayload(input);
    const existingBySlug = await this.repository.findBySlug(payload.slug);

    if (existingBySlug) {
      throw new EventServiceError("DUPLICATE_SLUG", "Un evenement avec ce slug existe deja.");
    }

    return this.repository.create(payload);
  }

  async update(id: string, input: EventPayload): Promise<ClubEvent> {
    const payload = this.validatePayload(input);
    const existingBySlug = await this.repository.findBySlug(payload.slug);
    if (existingBySlug && existingBySlug.id !== id) {
      throw new EventServiceError("DUPLICATE_SLUG", "Un evenement avec ce slug existe deja.");
    }

    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new EventServiceError("NOT_FOUND", "Evenement introuvable.");
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new EventServiceError("NOT_FOUND", "Evenement introuvable.");
    }
  }

  private validatePayload(input: EventPayload) {
    try {
      return eventSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new EventServiceError("VALIDATION_ERROR", error.issues[0]?.message ?? "Payload invalide.");
      }

      throw error;
    }
  }
}
