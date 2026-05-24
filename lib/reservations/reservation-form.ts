import { asCheckbox, asOptionalString, asString } from "@/lib/utils/form-data";

export function reservationPayloadFromFormData(formData: FormData) {
  const tableTypeRaw = asOptionalString(formData.get("table_type"));

  return {
    full_name: asString(formData.get("full_name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    event_id: asOptionalString(formData.get("event_id")),
    date_requested: asOptionalString(formData.get("date_requested")),
    arrival_time: asOptionalString(formData.get("arrival_time")),
    guest_count: Number(formData.get("guest_count")),
    table_type: tableTypeRaw as "standard" | "vip" | "lounge" | undefined,
    message: asOptionalString(formData.get("message")),
    source_locale: (asString(formData.get("source_locale")) || "fr") as "fr" | "en",
    consent_rgpd: asCheckbox(formData.get("consent_rgpd"))
  };
}
