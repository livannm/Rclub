export const locales = ["fr", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fr";

export function isSupportedLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function resolveLocale(value?: string | null): AppLocale {
  if (!value) {
    return defaultLocale;
  }

  return isSupportedLocale(value) ? value : defaultLocale;
}
