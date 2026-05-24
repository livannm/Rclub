import type { AdminReservationPayload, ReservationPayload, ReservationRequest, ReservationStatus } from "@/lib/reservations/reservation-schema";

export interface ReservationRepository {
  create(payload: ReservationPayload): Promise<ReservationRequest>;
  createByAdmin(payload: AdminReservationPayload): Promise<ReservationRequest>;
  findById(id: string): Promise<ReservationRequest | null>;
  listAll(): Promise<ReservationRequest[]>;
  updateStatus(id: string, status: ReservationStatus, extra?: { adminNotes?: string; notifiedAt?: Date }): Promise<ReservationRequest>;
  update(id: string, patch: Partial<AdminReservationPayload> & { notify_client?: boolean }): Promise<ReservationRequest>;
}
