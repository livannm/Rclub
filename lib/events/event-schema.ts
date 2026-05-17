import { z } from "zod";

export const eventSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: z
      .string()
      .min(3)
      .regex(/^[a-z0-9-]+$/),
    title_fr: z.string().min(2),
    title_en: z.string().min(2),
    description_fr: z.string().min(2),
    description_en: z.string().min(2),
    starts_at: z.string().datetime(),
    ends_at: z.string().datetime().optional(),
    location: z.string().min(2).default("Rclub Strasbourg"),
    cover_image_url: z.string().url(),
    hero_video_url: z.string().url().optional(),
    ticket_url: z.string().url().optional(),
    is_published: z.boolean().default(false)
  })
  .superRefine((value, context) => {
    if (!value.ends_at) {
      return;
    }

    const startsAt = new Date(value.starts_at);
    const endsAt = new Date(value.ends_at);
    if (endsAt < startsAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ends_at"],
        message: "La date de fin doit etre apres la date de debut."
      });
    }
  });

export type EventPayload = z.infer<typeof eventSchema>;

export type ClubEvent = EventPayload & {
  id: string;
  created_at: string;
  updated_at: string;
};
