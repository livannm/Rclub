import { ZodError } from "zod";
import { privatizationSchema } from "@/lib/privatizations/privatization-schema";
import type { PrivatizationRepository } from "@/lib/privatizations/privatization-repository";

export class PrivatizationServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class PrivatizationService {
  constructor(private readonly repository: PrivatizationRepository) {}

  async create(input: unknown) {
    try {
      const payload = privatizationSchema.parse(input);
      return this.repository.create(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new PrivatizationServiceError(error.issues[0]?.message ?? "Demande invalide.");
      }

      throw error;
    }
  }

  async listAll() {
    return this.repository.listAll();
  }
}
