import type { EventPayload } from "@/lib/events/event-schema";
import { asCheckbox, asOptionalString, asString } from "@/lib/utils/form-data";
import { sanitizeRichTextHtml } from "@/lib/utils/rich-text";
import { datetimeLocalParisToIso } from "@/lib/utils/club-date";

function toIsoDatetime(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  return datetimeLocalParisToIso(value);
}

export function eventPayloadFromFormData(formData: FormData): EventPayload {
  return {
    slug: asString(formData.get("slug")),
    title_fr: asString(formData.get("title_fr")),
    title_en: asString(formData.get("title_en")),
    description_fr: sanitizeRichTextHtml(asString(formData.get("description_fr"))),
    description_en: sanitizeRichTextHtml(asString(formData.get("description_en"))),
    starts_at: toIsoDatetime(asString(formData.get("starts_at"))) ?? "",
    ends_at: toIsoDatetime(asOptionalString(formData.get("ends_at"))),
    location: asString(formData.get("location")) || "Rclub Strasbourg",
    cover_image_url: asString(formData.get("cover_image_url")),
    hero_video_url: asOptionalString(formData.get("hero_video_url")),
    ticket_url: asOptionalString(formData.get("ticket_url")),
    is_published: asCheckbox(formData.get("is_published"))
  };
}
