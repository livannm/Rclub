import { asCheckbox, asOptionalString, asString } from "@/lib/utils/form-data";

export function privatizationPayloadFromFormData(formData: FormData) {
  return {
    full_name: asString(formData.get("full_name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    event_date: asOptionalString(formData.get("event_date")),
    guest_count: Number(formData.get("guest_count")),
    budget_range: asOptionalString(formData.get("budget_range")),
    message: asOptionalString(formData.get("message")),
    source_locale: (asString(formData.get("source_locale")) || "fr") as "fr" | "en",
    consent_rgpd: asCheckbox(formData.get("consent_rgpd"))
  };
}
