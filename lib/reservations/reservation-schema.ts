import { z } from "zod";

export const reservationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_id: z.string().uuid().optional(),
  date_requested: z.string().date().optional(),
  arrival_time: z.string().optional(),
  guest_count: z.coerce.number().int().min(1),
  table_type: z.enum(["standard", "vip", "lounge"]).optional(),
  message: z.string().max(2000).optional(),
  source_locale: z.enum(["fr", "en"]),
  consent_rgpd: z.literal(true)
});

export const adminReservationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_id: z.string().uuid().optional(),
  date_requested: z.string().date().optional(),
  guest_count: z.coerce.number().int().min(1),
  admin_notes: z.string().max(2000).optional(),
  notify_client: z.boolean().optional()
});

export type ReservationPayload = z.infer<typeof reservationSchema>;
export type AdminReservationPayload = z.infer<typeof adminReservationSchema>;

export type ReservationStatus = "new" | "reviewed" | "contacted" | "confirmed" | "refused" | "closed";

export type ReservationRequest = ReservationPayload & {
  id: string;
  status: ReservationStatus;
  admin_notes?: string;
  notified_at?: string;
  confirmed_at?: string;
  refused_at?: string;
  created_by_admin: boolean;
  created_at: string;
  updated_at: string;
};

export const TABLE_TYPES = [
  { value: "standard", labelFr: "Table standard", labelEn: "Standard table" },
  { value: "vip", labelFr: "Carré VIP", labelEn: "VIP booth" },
  { value: "lounge", labelFr: "Lounge / Banquette", labelEn: "Lounge / Banquette" }
] as const;
