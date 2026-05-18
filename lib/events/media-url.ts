import { z } from "zod";

export function isMediaUrl(value: string) {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

export const mediaUrlSchema = z
  .string()
  .min(1)
  .refine(isMediaUrl, { message: "URL invalide (chemin /media/... ou https://)." });
