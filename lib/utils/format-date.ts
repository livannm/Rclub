import type { AppLocale } from "@/i18n/locales";
import { getClubEveningDate, parseIsoDate } from "@/lib/utils/club-date";

const LOCALE_INTL_MAP: Record<AppLocale, string> = {
  fr: "fr-FR",
  en: "en-US"
};

const TZ = "Europe/Paris";

export function formatEventDateTime(isoDate: string, locale: AppLocale): string {
  return new Date(isoDate).toLocaleString(LOCALE_INTL_MAP[locale], { timeZone: TZ });
}

export function formatEventDate(isoDate: string, locale: AppLocale): string {
  return new Date(isoDate).toLocaleDateString(LOCALE_INTL_MAP[locale], {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function formatEventTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("fr-FR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit"
  });
}

/** Day/month badge for an event, keyed on club evening date (start of the night). */
export function formatClubEveningBadge(startsAtIso: string, locale: AppLocale) {
  const { day, month } = parseIsoDate(getClubEveningDate(startsAtIso));
  const monthLabel = new Date(2000, month - 1, 1).toLocaleDateString(LOCALE_INTL_MAP[locale], {
    month: "short"
  });

  return {
    day: String(day).padStart(2, "0"),
    month: monthLabel.toUpperCase()
  };
}
