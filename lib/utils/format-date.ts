import type { AppLocale } from "@/i18n/locales";

const LOCALE_INTL_MAP: Record<AppLocale, string> = {
  fr: "fr-FR",
  en: "en-US"
};

export function formatEventDateTime(isoDate: string, locale: AppLocale): string {
  return new Date(isoDate).toLocaleString(LOCALE_INTL_MAP[locale]);
}
