import type { ReservationPayload, ReservationRequest } from "@/lib/reservations/reservation-schema";
import type { ReservationRepository } from "@/lib/reservations/reservation-repository";

export class InMemoryReservationRepository implements ReservationRepository {
  private requests: ReservationRequest[] = [];

  async create(payload: ReservationPayload) {
    const created: ReservationRequest = {
      ...payload,
      id: crypto.randomUUID(),
      status: "new",
      created_at: new Date().toISOString()
    };

    this.requests.push(created);
    return created;
  }

  async listAll() {
    return [...this.requests];
  }
}
