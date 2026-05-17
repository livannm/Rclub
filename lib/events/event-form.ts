import type { EventPayload } from "@/lib/events/event-schema";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toIsoDatetime(value: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
}

export function eventPayloadFromFormData(formData: FormData): EventPayload {
  return {
    slug: asString(formData.get("slug")),
    title_fr: asString(formData.get("title_fr")),
    title_en: asString(formData.get("title_en")),
    description_fr: asString(formData.get("description_fr")),
    description_en: asString(formData.get("description_en")),
    starts_at: toIsoDatetime(asString(formData.get("starts_at"))),
    ends_at: toIsoDatetime(asString(formData.get("ends_at"))) || undefined,
    location: asString(formData.get("location")) || "Rclub Strasbourg",
    cover_image_url: asString(formData.get("cover_image_url")),
    hero_video_url: asString(formData.get("hero_video_url")) || undefined,
    ticket_url: asString(formData.get("ticket_url")) || undefined,
    is_published: formData.get("is_published") === "on"
  };
}
