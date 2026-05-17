function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function reservationPayloadFromFormData(formData: FormData) {
  return {
    full_name: asString(formData.get("full_name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    event_id: asString(formData.get("event_id")) || undefined,
    date_requested: asString(formData.get("date_requested")) || undefined,
    guest_count: Number(formData.get("guest_count")),
    message: asString(formData.get("message")) || undefined,
    source_locale: (asString(formData.get("source_locale")) || "fr") as "fr" | "en",
    consent_rgpd: formData.get("consent_rgpd") === "on"
  };
}
