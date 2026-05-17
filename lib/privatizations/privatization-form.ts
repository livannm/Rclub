function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function privatizationPayloadFromFormData(formData: FormData) {
  return {
    full_name: asString(formData.get("full_name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    event_date: asString(formData.get("event_date")) || undefined,
    guest_count: Number(formData.get("guest_count")),
    budget_range: asString(formData.get("budget_range")) || undefined,
    message: asString(formData.get("message")) || undefined,
    source_locale: (asString(formData.get("source_locale")) || "fr") as "fr" | "en",
    consent_rgpd: formData.get("consent_rgpd") === "on"
  };
}
