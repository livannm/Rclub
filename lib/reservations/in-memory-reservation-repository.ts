import type { AdminReservationPayload, ReservationPayload, ReservationRequest, ReservationStatus } from "@/lib/reservations/reservation-schema";
import type { ReservationRepository } from "@/lib/reservations/reservation-repository";

export class InMemoryReservationRepository implements ReservationRepository {
  private requests: ReservationRequest[] = [];

  async create(payload: ReservationPayload) {
    const now = new Date().toISOString();
    const created: ReservationRequest = {
      ...payload,
      id: crypto.randomUUID(),
      status: "new",
      created_by_admin: false,
      created_at: now,
      updated_at: now
    };
    this.requests.push(created);
    return created;
  }

  async createByAdmin(payload: AdminReservationPayload) {
    const now = new Date().toISOString();
    const created: ReservationRequest = {
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      event_id: payload.event_id,
      date_requested: payload.date_requested,
      guest_count: payload.guest_count,
      admin_notes: payload.admin_notes,
      source_locale: "fr",
      consent_rgpd: true,
      id: crypto.randomUUID(),
      status: "confirmed",
      created_by_admin: true,
      confirmed_at: now,
      created_at: now,
      updated_at: now
    };
    this.requests.push(created);
    return created;
  }

  async findById(id: string) {
    return this.requests.find((r) => r.id === id) ?? null;
  }

  async listAll() {
    return [...this.requests];
  }

  async updateStatus(
    id: string,
    status: ReservationStatus,
    extra?: { adminNotes?: string; notifiedAt?: Date }
  ) {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new Error(`Reservation ${id} not found`);

    req.status = status;
    req.updated_at = new Date().toISOString();
    if (status === "confirmed") req.confirmed_at = new Date().toISOString();
    if (status === "refused") req.refused_at = new Date().toISOString();
    if (extra?.adminNotes !== undefined) req.admin_notes = extra.adminNotes;
    if (extra?.notifiedAt) req.notified_at = extra.notifiedAt.toISOString();

    return req;
  }

  async update(id: string, patch: Partial<AdminReservationPayload>) {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new Error(`Reservation ${id} not found`);

    if (patch.full_name !== undefined) req.full_name = patch.full_name;
    if (patch.email !== undefined) req.email = patch.email;
    if (patch.phone !== undefined) req.phone = patch.phone;
    if (patch.event_id !== undefined) req.event_id = patch.event_id;
    if (patch.date_requested !== undefined) req.date_requested = patch.date_requested;
    if (patch.guest_count !== undefined) req.guest_count = patch.guest_count;
    if (patch.admin_notes !== undefined) req.admin_notes = patch.admin_notes;
    req.updated_at = new Date().toISOString();

    return req;
  }
}
