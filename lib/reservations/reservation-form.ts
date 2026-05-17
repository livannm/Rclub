import { asCheckbox, asOptionalString, asString } from "@/lib/utils/form-data";

export function reservationPayloadFromFormData(formData: FormData) {
  return {
    full_name: asString(formData.get("full_name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    event_id: asOptionalString(formData.get("event_id")),
    date_requested: asOptionalString(formData.get("date_requested")),
    guest_count: Number(formData.get("guest_count")),
    message: asOptionalString(formData.get("message")),
    source_locale: (asString(formData.get("source_locale")) || "fr") as "fr" | "en",
    consent_rgpd: asCheckbox(formData.get("consent_rgpd"))
  };
}
