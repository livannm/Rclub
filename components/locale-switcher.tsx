"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function buildRedirectPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function persistLocale(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

const buttonStyle = {
  background: "none",
  border: "none",
  padding: 0,
  color: "inherit",
  cursor: "pointer"
} as const;

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = buildRedirectPath(pathname, searchParams);

  function switchLocale(locale: AppLocale) {
    persistLocale(locale);
    window.location.assign(redirectTo);
  }

  return (
    <nav aria-label={t("label")} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
      <button
        data-testid="locale-switch-fr"
        type="button"
        onClick={() => switchLocale("fr")}
        style={buttonStyle}
      >
        {t("fr")}
      </button>
      <button
        data-testid="locale-switch-en"
        type="button"
        onClick={() => switchLocale("en")}
        style={buttonStyle}
      >
        {t("en")}
      </button>
    </nav>
  );
}
