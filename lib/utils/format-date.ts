import type { AppLocale } from "@/i18n/locales";

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
