"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function buildRedirectPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function persistLocale(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = buildRedirectPath(pathname, searchParams);

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    persistLocale(nextLocale);
    window.location.assign(redirectTo);
  }

  return (
    <nav aria-label={t("label")} className="locale-switcher">
      <button
        data-testid="locale-switch-fr"
        type="button"
        className={locale === "fr" ? "is-active" : undefined}
        aria-current={locale === "fr" ? "true" : undefined}
        onClick={() => switchLocale("fr")}
      >
        {t("fr")}
      </button>
      <button
        data-testid="locale-switch-en"
        type="button"
        className={locale === "en" ? "is-active" : undefined}
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => switchLocale("en")}
      >
        {t("en")}
      </button>
    </nav>
  );
}
