import { z } from "zod";

export const reservationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_id: z.string().uuid().optional(),
  date_requested: z.string().date().optional(),
  guest_count: z.coerce.number().int().min(1),
  message: z.string().max(2000).optional(),
  source_locale: z.enum(["fr", "en"]),
  consent_rgpd: z.literal(true)
});

export type ReservationPayload = z.infer<typeof reservationSchema>;

export type ReservationRequest = ReservationPayload & {
  id: string;
  status: "new" | "reviewed" | "contacted" | "closed";
  created_at: string;
};
