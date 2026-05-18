import type { PrismaClient } from "@prisma/client";
import type {
  PrivatizationPayload,
  PrivatizationRequest
} from "@/lib/privatizations/privatization-schema";
import type { PrivatizationRepository } from "@/lib/privatizations/privatization-repository";

function toPrivatizationRequest(
  row: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    eventDate: Date | null;
    guestCount: number;
    budgetRange: string | null;
    message: string | null;
    status: "new" | "reviewed" | "contacted" | "closed";
    sourceLocale: string;
    consentRgpd: boolean;
    createdAt: Date;
  }
): PrivatizationRequest {
  return {
    id: row.id,
    full_name: row.fullName,
    email: row.email,
    phone: row.phone,
    event_date: row.eventDate?.toISOString().slice(0, 10),
    guest_count: row.guestCount,
    budget_range: row.budgetRange ?? undefined,
    message: row.message ?? undefined,
    status: row.status,
    source_locale: row.sourceLocale as "fr" | "en",
    consent_rgpd: true,
    created_at: row.createdAt.toISOString()
  };
}

export class PrismaPrivatizationRepository implements PrivatizationRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(payload: PrivatizationPayload) {
    const row = await this.db.privatizationRequest.create({
      data: {
        fullName: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        eventDate: payload.event_date ? new Date(payload.event_date) : null,
        guestCount: payload.guest_count,
        budgetRange: payload.budget_range ?? null,
        message: payload.message ?? null,
        sourceLocale: payload.source_locale,
        consentRgpd: payload.consent_rgpd
      }
    });

    return toPrivatizationRequest(row);
  }

  async listAll() {
    const rows = await this.db.privatizationRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows.map(toPrivatizationRequest);
  }
}
