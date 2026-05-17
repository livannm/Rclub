"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function buildRedirectPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = buildRedirectPath(pathname, new URLSearchParams(searchParams.toString()));

  function switchLocale(locale: "fr" | "en") {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.assign(redirectTo);
  }

  return (
    <nav aria-label={t("label")} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
      <button
        data-testid="locale-switch-fr"
        type="button"
        onClick={() => switchLocale("fr")}
        style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer" }}
      >
        {t("fr")}
      </button>
      <button
        data-testid="locale-switch-en"
        type="button"
        onClick={() => switchLocale("en")}
        style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer" }}
      >
        {t("en")}
      </button>
    </nav>
  );
}
