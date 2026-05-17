import { z } from "zod";

export const privatizationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_date: z.string().date().optional(),
  guest_count: z.coerce.number().int().min(1),
  budget_range: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  source_locale: z.enum(["fr", "en"]),
  consent_rgpd: z.literal(true)
});

export type PrivatizationPayload = z.infer<typeof privatizationSchema>;

export type PrivatizationRequest = PrivatizationPayload & {
  id: string;
  status: "new" | "reviewed" | "contacted" | "closed";
  created_at: string;
};
