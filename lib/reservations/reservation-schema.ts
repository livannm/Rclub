import { z } from "zod";
import { ALL_ARRIVAL_SLOTS, PUBLIC_ARRIVAL_SLOTS } from "./arrival-slots";
import { isDateBeforeTodayParis } from "@/lib/utils/club-date";

const publicSlots = PUBLIC_ARRIVAL_SLOTS as unknown as [string, ...string[]];
const adminSlots = ALL_ARRIVAL_SLOTS as unknown as [string, ...string[]];

export const reservationSchema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    event_id: z.string().uuid().optional(),
    date_requested: z.string().date().optional(),
    arrival_time: z.enum(publicSlots),
    guest_count: z.coerce.number().int().min(1),
    table_type: z.enum(["classique", "prestige", "vip"]).optional(),
    occasion_type: z.enum(["evg", "evjf", "anniversaire", "autre"]).optional(),
    message: z.string().max(2000).optional(),
    source_locale: z.enum(["fr", "en"]),
    consent_rgpd: z.literal(true),
  })
  .superRefine((data, ctx) => {
    if (!data.table_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.source_locale === "fr"
            ? "Veuillez choisir un type de table."
            : "Please select a table type.",
        path: ["table_type"],
      });
    }

    if (data.date_requested && isDateBeforeTodayParis(data.date_requested)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.source_locale === "fr"
            ? "La date choisie ne peut pas être antérieure à aujourd'hui."
            : "The selected date cannot be before today.",
        path: ["date_requested"],
      });
    }
  });

export const adminReservationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_id: z.string().uuid().optional(),
  date_requested: z.string().date().optional(),
  arrival_time: z.enum(adminSlots).optional(),
  guest_count: z.coerce.number().int().min(1),
  admin_notes: z.string().max(2000).optional(),
  notify_client: z.boolean().optional()
});

export type ReservationPayload = z.infer<typeof reservationSchema>;
export type AdminReservationPayload = z.infer<typeof adminReservationSchema>;

export type ReservationStatus = "new" | "confirmed" | "refused" | "cancelled";

export type ReservationRequest = Omit<ReservationPayload, "consent_rgpd" | "arrival_time"> & {
  id: string;
  status: ReservationStatus;
  admin_notes?: string;
  notified_at?: string;
  confirmed_at?: string;
  refused_at?: string;
  cancelled_at?: string;
  created_by_admin: boolean;
  created_at: string;
  updated_at: string;
  consent_rgpd?: true;
  arrival_time?: string;
};

export const TABLE_TYPES = [
  { value: "classique", labelFr: "Table Classique", labelEn: "Classic Table" },
  { value: "prestige", labelFr: "Table Prestige", labelEn: "Prestige Table" },
  { value: "vip", labelFr: "Carré VIP", labelEn: "VIP Booth" }
] as const;

export const OCCASION_TYPES = [
  { value: "evg", labelFr: "EVG", labelEn: "Bachelor party" },
  { value: "evjf", labelFr: "EVJF", labelEn: "Bachelorette party" },
  { value: "anniversaire", labelFr: "Anniversaire", labelEn: "Birthday" },
  { value: "autre", labelFr: "Autre occasion", labelEn: "Other occasion" }
] as const;
