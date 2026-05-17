import { ZodError } from "zod";
import type { HomepageContentRepository } from "@/lib/homepage/homepage-content-repository";
import { homepageContentSchema, type HomepageContentPayload } from "@/lib/homepage/homepage-content-schema";

export type HomepageContentServiceErrorCode = "VALIDATION_ERROR";

export class HomepageContentServiceError extends Error {
  constructor(
    public readonly code: HomepageContentServiceErrorCode,
    message: string
  ) {
    super(message);
  }
}

export class HomepageContentService {
  constructor(private readonly repository: HomepageContentRepository) {}

  async get() {
    return this.repository.get();
  }

  async update(input: HomepageContentPayload) {
    const payload = this.validatePayload(input);
    return this.repository.save(payload);
  }

  private validatePayload(input: HomepageContentPayload) {
    try {
      return homepageContentSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HomepageContentServiceError(
          "VALIDATION_ERROR",
          error.issues[0]?.message ?? "Le contenu de la page d'accueil est invalide."
        );
      }

      throw error;
    }
  }
}
