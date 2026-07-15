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
};

function getParisParts(isoDate: string): ParisParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(isoDate));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
  };
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
