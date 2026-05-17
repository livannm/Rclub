import { z } from "zod";

export const homepageContentSchema = z.object({
  title_fr: z.string().trim().min(1, "Le titre FR est requis.").max(120, "Le titre FR est trop long."),
  title_en: z.string().trim().min(1, "Le titre EN est requis.").max(120, "The EN title is too long."),
  description_fr: z
    .string()
    .trim()
    .min(1, "La description FR est requise.")
    .max(500, "La description FR est trop longue."),
  description_en: z
    .string()
    .trim()
    .min(1, "The EN description is required.")
    .max(500, "The EN description is too long.")
});

export type HomepageContentPayload = z.infer<typeof homepageContentSchema>;

export type HomepageContent = HomepageContentPayload & {
  updated_at: string;
};
