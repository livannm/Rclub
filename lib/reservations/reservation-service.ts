import { ZodError } from "zod";
import { adminReservationSchema, reservationSchema } from "@/lib/reservations/reservation-schema";
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

  async createByAdmin(input: unknown) {
    try {
      const payload = adminReservationSchema.parse(input);
      return this.repository.createByAdmin(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ReservationServiceError(error.issues[0]?.message ?? "Données invalides.");
      }
      throw error;
    }
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async listAll() {
    return this.repository.listAll();
  }

  async confirm(id: string, adminNotes?: string) {
    return this.repository.updateStatus(id, "confirmed", {
      adminNotes,
      notifiedAt: new Date()
    });
  }

  async refuse(id: string, adminNotes?: string) {
    return this.repository.updateStatus(id, "refused", {
      adminNotes,
      notifiedAt: new Date()
    });
  }

  async cancel(id: string, adminNotes?: string) {
    return this.repository.updateStatus(id, "cancelled", {
      adminNotes,
      notifiedAt: new Date()
    });
  }

  async update(id: string, patch: Parameters<ReservationRepository["update"]>[1]) {
    return this.repository.update(id, patch);
  }
}
