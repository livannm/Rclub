import { ZodError } from "zod";
import { reservationSchema } from "@/lib/reservations/reservation-schema";
import type { ReservationRepository } from "@/lib/reservations/reservation-repository";

export class ReservationServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ReservationService {
  constructor(private readonly repository: ReservationRepository) {}

  async create(input: unknown) {
    try {
      const payload = reservationSchema.parse(input);
      return this.repository.create(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ReservationServiceError(error.issues[0]?.message ?? "Reservation invalide.");
      }

      throw error;
    }
  }

  async listAll() {
    return this.repository.listAll();
  }
}
