import type { ReservationPayload, ReservationRequest } from "@/lib/reservations/reservation-schema";

export interface ReservationRepository {
  create(payload: ReservationPayload): Promise<ReservationRequest>;
  listAll(): Promise<ReservationRequest[]>;
}
