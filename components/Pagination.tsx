"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { pageHref } from "@/lib/utils/pagination";

type Props = {
  path: string;
  query?: Record<string, string>;
  page: number;
  totalPages: number;
};

export function Pagination({ path, query = {}, page, totalPages }: Props) {
  const t = useTranslations("Pagination");
  if (totalPages <= 1) return null;

  const visible = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(value => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  return (
    <nav className="pagination" aria-label={t("label")}>
      <p className="pagination-summary" aria-live="polite">{t("summary", { page, total: totalPages })}</p>
      <div className="pagination-controls">
        {page > 1 ? (
          <Link className="pagination-direction" href={pageHref(path, query, page - 1)} prefetch={false} rel="prev">{t("previous")}</Link>
        ) : <span className="pagination-direction" aria-disabled="true">{t("previous")}</span>}
        <div className="pagination-pages">
          {visible.map((value, index) => (
            <span key={value} className="pagination-slot">
              {index > 0 && value - visible[index - 1] > 1 ? <span className="pagination-gap" aria-hidden="true">…</span> : null}
              <Link
                href={pageHref(path, query, value)} prefetch={false}
                aria-label={t("goToPage", { page: value })}
                aria-current={value === page ? "page" : undefined}
              >{value}</Link>
            </span>
          ))}
        </div>
        {page < totalPages ? (
          <Link className="pagination-direction" href={pageHref(path, query, page + 1)} prefetch={false} rel="next">{t("next")}</Link>
        ) : <span className="pagination-direction" aria-disabled="true">{t("next")}</span>}
      </div>
    </nav>
  );
}
