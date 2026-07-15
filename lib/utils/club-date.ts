import type { AppLocale } from "@/i18n/locales";

export const PARIS_TZ = "Europe/Paris";
const POST_MIDNIGHT_HOUR_THRESHOLD = 12;

const LOCALE_INTL_MAP: Record<AppLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

type ParisParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function getParisParts(isoDate: string): ParisParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(isoDate));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

export function parseIsoDate(dateIso: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateIso.split("-").map(Number);
  return { year, month, day };
}

export function getClubEveningParts(startsAtIso: string) {
  return parseIsoDate(getClubEveningDate(startsAtIso));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Days from today (Paris) until the event's club evening date. */
export function daysUntilClubEvening(startsAtIso: string, now = new Date()): number {
  const evening = getClubEveningDate(startsAtIso);
  const today = getTodayParisIso(now);
  const { year: ey, month: em, day: ed } = parseIsoDate(evening);
  const { year: ty, month: tm, day: td } = parseIsoDate(today);
  const eveningMs = Date.UTC(ey, em - 1, ed);
  const todayMs = Date.UTC(ty, tm - 1, td);
  return Math.max(0, Math.round((eveningMs - todayMs) / MS_PER_DAY));
}

/** ISO instant → `datetime-local` value interpreted as Europe/Paris. */
export function isoToDatetimeLocalParis(isoDate: string): string {
  const { year, month, day, hour, minute } = getParisParts(isoDate);
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${toIsoDate(year, month, day)}T${h}:${m}`;
}

/** `datetime-local` value (Europe/Paris) → ISO instant. */
export function datetimeLocalParisToIso(localValue: string): string {
  const [datePart, timePart] = localValue.split("T");
  const { year, month, day } = parseIsoDate(datePart);
  const [hour, minute] = timePart.split(":").map(Number);

  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 4; i++) {
    const parts = getParisParts(new Date(guess).toISOString());
    const target = Date.UTC(year, month - 1, day, hour, minute);
    const actual = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    guess += target - actual;
  }

  return new Date(guess).toISOString();
}

function toIsoDate(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftIsoDate(dateIso: string, dayOffset: number): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  const shifted = new Date(year, month - 1, day);
  shifted.setDate(shifted.getDate() + dayOffset);
  return toIsoDate(shifted.getFullYear(), shifted.getMonth() + 1, shifted.getDate());
}

/** Calendar date in Europe/Paris for an ISO instant. */
export function getParisDateIso(isoDate: string): string {
  const { year, month, day } = getParisParts(isoDate);
  return toIsoDate(year, month, day);
}

/**
 * Nightclub "evening" date: events after midnight belong to the previous calendar evening.
 * Example: 2026-05-24T01:00 Paris → evening date 2026-05-23.
 */
export function getClubEveningDate(isoDate: string): string {
  const parisDate = getParisDateIso(isoDate);
  const { hour } = getParisParts(isoDate);
  return hour < POST_MIDNIGHT_HOUR_THRESHOLD ? shiftIsoDate(parisDate, -1) : parisDate;
}

export function getTodayParisIso(now = new Date()): string {
  return getParisDateIso(now.toISOString());
}

export function isDateBeforeTodayParis(dateIso: string, now = new Date()): boolean {
  return dateIso < getTodayParisIso(now);
}

/** Formats a plain YYYY-MM-DD value without timezone shifts. */
export function formatRequestedDate(dateIso: string, locale: AppLocale): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(LOCALE_INTL_MAP[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function eventMatchesClubEveningDate(eventStartsAt: string, dateIso: string): boolean {
  return getClubEveningDate(eventStartsAt) === dateIso;
}
