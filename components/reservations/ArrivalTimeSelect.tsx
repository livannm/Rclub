"use client";

import { useMemo } from "react";
import {
  ALL_ARRIVAL_SLOTS,
  PUBLIC_ARRIVAL_SLOTS,
  formatArrivalTimeLabel,
  type AdminArrivalSlot,
  type PublicArrivalSlot,
} from "@/lib/reservations/arrival-slots";

type Props = {
  id?: string;
  name?: string;
  required?: boolean;
  placeholder: string;
  hint?: string;
  locale: string;
  defaultValue?: string;
  dateValue?: string;
  variant?: "public" | "admin";
  className?: string;
};

function nextDayLabel(dateRequested: string, locale: string): string {
  const d = new Date(`${dateRequested}T12:00:00`);
  d.setDate(d.getDate() + 1);
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";
  return d.toLocaleDateString(intlLocale, { weekday: "short" });
}

function slotLabel(slot: string, dateRequested: string | undefined, locale: string): string {
  const base = formatArrivalTimeLabel(slot);
  const [hour] = slot.split(":").map(Number);
  if (hour < 12 && dateRequested) {
    const day = nextDayLabel(dateRequested, locale);
    return `${base} (${day})`;
  }
  return base;
}

export function ArrivalTimeSelect({
  id = "arrival_time",
  name = "arrival_time",
  required,
  placeholder,
  hint,
  locale,
  defaultValue,
  dateValue,
  variant = "public",
  className = "rclub-input rclub-select",
}: Props) {
  const slots = useMemo(
    () => (variant === "admin" ? ALL_ARRIVAL_SLOTS : PUBLIC_ARRIVAL_SLOTS),
    [variant]
  );

  return (
    <div className="rclub-arrival-field">
      <select
        id={id}
        name={name}
        required={required}
        className={className}
        defaultValue={defaultValue ?? ""}
      >
        <option value="">{placeholder}</option>
        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {slotLabel(slot, dateValue, locale)}
          </option>
        ))}
      </select>
      {hint ? <p className="rclub-field-hint">{hint}</p> : null}
    </div>
  );
}

export type { PublicArrivalSlot, AdminArrivalSlot };
