import { z } from "zod";

export const privatizationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_date: z.string().date().optional(),
  guest_count: z.coerce.number().int().min(1),
  budget_range: z.string().max(120).optional(),
  event_type: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
  source_locale: z.enum(["fr", "en"]),
  consent_rgpd: z.literal(true)
});

export const EVENT_TYPES = [
  { value: "anniversaire", labelFr: "Anniversaire" },
  { value: "entreprise", labelFr: "Événement d'entreprise" },
  { value: "mariage", labelFr: "EVJF / EVG" },
  { value: "soiree_privee", labelFr: "Soirée privée" },
  { value: "autre", labelFr: "Autre" }
] as const;

export type PrivatizationPayload = z.infer<typeof privatizationSchema>;

export type PrivatizationRequest = PrivatizationPayload & {
  id: string;
  status: "new" | "confirmed" | "refused" | "cancelled";
  created_at: string;
};
