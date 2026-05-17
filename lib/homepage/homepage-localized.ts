import type { AppLocale } from "@/i18n/locales";
import type { HomepageContent } from "@/lib/homepage/homepage-content-schema";

export type LocalizedHomepageContent = {
  title: string;
  description: string;
};

export function getLocalizedHomepageContent(
  content: HomepageContent,
  locale: AppLocale
): LocalizedHomepageContent {
  if (locale === "en") {
    return {
      title: content.title_en,
      description: content.description_en
    };
  }

  return {
    title: content.title_fr,
    description: content.description_fr
  };
}
