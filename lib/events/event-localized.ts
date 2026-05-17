import type { AppLocale } from "@/i18n/locales";

type TranslatedEventFields = {
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
};

export function getLocalizedEventContent(event: TranslatedEventFields, locale: AppLocale) {
  if (locale === "en") {
    return {
      title: event.title_en,
      description: event.description_en
    };
  }

  return {
    title: event.title_fr,
    description: event.description_fr
  };
}
