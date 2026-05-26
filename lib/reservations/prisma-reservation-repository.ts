import type { PrismaClient, ReservationRequest as PrismaRow } from "@prisma/client";
import type { AdminReservationPayload, ReservationPayload, ReservationRequest, ReservationStatus } from "@/lib/reservations/reservation-schema";
import type { ReservationRepository } from "@/lib/reservations/reservation-repository";

function toReservationRequest(row: PrismaRow): ReservationRequest {
  return {
    id: row.id,
    full_name: row.fullName,
    email: row.email,
    phone: row.phone,
    event_id: row.eventId ?? undefined,
    date_requested: row.dateRequested?.toISOString().slice(0, 10),
    arrival_time: row.arrivalTime ?? undefined,
    guest_count: row.guestCount,
    table_type: row.tableType as "classique" | "prestige" | "vip" | undefined,
    occasion_type: row.occasionType as "evg" | "evjf" | "anniversaire" | "autre" | undefined,
    message: row.message ?? undefined,
    status: row.status as ReservationStatus,
    source_locale: row.sourceLocale as "fr" | "en",
    consent_rgpd: true,
    admin_notes: row.adminNotes ?? undefined,
    notified_at: row.notifiedAt?.toISOString(),
    confirmed_at: row.confirmedAt?.toISOString(),
    refused_at: row.refusedAt?.toISOString(),
    cancelled_at: row.cancelledAt?.toISOString(),
    created_by_admin: row.createdByAdmin,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString()
  };
}

export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(payload: ReservationPayload) {
    const row = await this.db.reservationRequest.create({
      data: {
        fullName: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        eventId: payload.event_id ?? null,
        dateRequested: payload.date_requested ? new Date(payload.date_requested) : null,
        guestCount: payload.guest_count,
        message: payload.message ?? null,
        arrivalTime: payload.arrival_time ?? null,
        tableType: payload.table_type ?? null,
        occasionType: payload.occasion_type ?? null,
        sourceLocale: payload.source_locale,
        consentRgpd: payload.consent_rgpd
      }
    });
    return toReservationRequest(row);
  }

  async createByAdmin(payload: AdminReservationPayload) {
    const row = await this.db.reservationRequest.create({
      data: {
        fullName: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        eventId: payload.event_id ?? null,
        dateRequested: payload.date_requested ? new Date(payload.date_requested) : null,
        guestCount: payload.guest_count,
        adminNotes: payload.admin_notes ?? null,
        sourceLocale: "fr",
        consentRgpd: true,
        status: "confirmed",
        createdByAdmin: true,
        confirmedAt: new Date()
      }
    });
    return toReservationRequest(row);
  }

  async findById(id: string) {
    const row = await this.db.reservationRequest.findUnique({ where: { id } });
    return row ? toReservationRequest(row) : null;
  }

  async listAll() {
    const rows = await this.db.reservationRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows.map(toReservationRequest);
  }

  async updateStatus(
    id: string,
    status: ReservationStatus,
    extra?: { adminNotes?: string; notifiedAt?: Date }
  ) {
    const data: Record<string, unknown> = { status };
    if (status === "confirmed") data.confirmedAt = new Date();
    if (status === "refused") data.refusedAt = new Date();
    if (status === "cancelled") data.cancelledAt = new Date();
    if (extra?.adminNotes !== undefined) data.adminNotes = extra.adminNotes;
    if (extra?.notifiedAt) data.notifiedAt = extra.notifiedAt;

    const row = await this.db.reservationRequest.update({ where: { id }, data });
    return toReservationRequest(row);
  }

  async update(id: string, patch: Partial<AdminReservationPayload>) {
    const data: Record<string, unknown> = {};
    if (patch.full_name !== undefined) data.fullName = patch.full_name;
    if (patch.email !== undefined) data.email = patch.email;
    if (patch.phone !== undefined) data.phone = patch.phone;
    if (patch.event_id !== undefined) data.eventId = patch.event_id;
    if (patch.date_requested !== undefined)
      data.dateRequested = patch.date_requested ? new Date(patch.date_requested) : null;
    if (patch.guest_count !== undefined) data.guestCount = patch.guest_count;
    if (patch.admin_notes !== undefined) data.adminNotes = patch.admin_notes;

    const row = await this.db.reservationRequest.update({ where: { id }, data });
    return toReservationRequest(row);
  }
}
