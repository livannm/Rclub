import type { PrismaClient } from "@prisma/client";
import type { ReservationPayload, ReservationRequest } from "@/lib/reservations/reservation-schema";
import type { ReservationRepository } from "@/lib/reservations/reservation-repository";

function toReservationRequest(
  row: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    eventId: string | null;
    dateRequested: Date | null;
    guestCount: number;
    message: string | null;
    status: "new" | "reviewed" | "contacted" | "closed";
    sourceLocale: string;
    consentRgpd: boolean;
    createdAt: Date;
  }
): ReservationRequest {
  return {
    id: row.id,
    full_name: row.fullName,
    email: row.email,
    phone: row.phone,
    event_id: row.eventId ?? undefined,
    date_requested: row.dateRequested?.toISOString().slice(0, 10),
    guest_count: row.guestCount,
    message: row.message ?? undefined,
    status: row.status,
    source_locale: row.sourceLocale as "fr" | "en",
    consent_rgpd: true,
    created_at: row.createdAt.toISOString()
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
        sourceLocale: payload.source_locale,
        consentRgpd: payload.consent_rgpd
      }
    });

    return toReservationRequest(row);
  }

  async listAll() {
    const rows = await this.db.reservationRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows.map(toReservationRequest);
  }
}
