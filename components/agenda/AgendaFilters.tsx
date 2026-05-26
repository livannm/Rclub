"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface MonthOption {
  value: number;
  label: string;
}

interface Props {
  years: number[];
  monthsByYear: Record<number, MonthOption[]>;
  currentYear: number | null;
  currentMonth: number | null;
  showPast: boolean;
  labelAll: string;
  labelShowPast: string;
}

export function AgendaFilters({
  years,
  monthsByYear,
  currentYear,
  currentMonth,
  showPast,
  labelAll,
  labelShowPast,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (year: number | null, month: number | null, past?: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (year != null) {
        params.set("year", String(year));
      } else {
        params.delete("year");
      }
      if (month != null) {
        params.set("month", String(month));
      } else {
        params.delete("month");
      }
      if (past != null) {
        if (past) {
          params.set("past", "1");
        } else {
          params.delete("past");
        }
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const togglePast = useCallback(() => {
    setParams(currentYear, currentMonth, !showPast);
  }, [setParams, currentYear, currentMonth, showPast]);

  const months = currentYear != null ? (monthsByYear[currentYear] ?? []) : [];

  return (
    <div className="agenda-filters">
      <div className="agenda-filters-top-row">
        <div className="agenda-filters-row" role="group" aria-label="Filtrer par année">
          <button
            type="button"
            className={`agenda-filter-pill${currentYear === null ? " agenda-filter-pill--active" : ""}`}
            onClick={() => setParams(null, null)}
          >
            {labelAll}
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={`agenda-filter-pill${currentYear === year ? " agenda-filter-pill--active" : ""}`}
              onClick={() => setParams(year, null)}
            >
              {year}
            </button>
          ))}
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={showPast}
          className={`agenda-filter-pill agenda-filter-pill--past${showPast ? " agenda-filter-pill--active" : ""}`}
          onClick={togglePast}
        >
          {showPast ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
          {labelShowPast}
        </button>
      </div>

      {currentYear != null && months.length > 1 && (
        <div className="agenda-filters-row agenda-filters-row--months" role="group" aria-label="Filtrer par mois">
          <button
            type="button"
            className={`agenda-filter-pill agenda-filter-pill--sm${currentMonth === null ? " agenda-filter-pill--active" : ""}`}
            onClick={() => setParams(currentYear, null)}
          >
            {labelAll}
          </button>
          {months.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`agenda-filter-pill agenda-filter-pill--sm${currentMonth === value ? " agenda-filter-pill--active" : ""}`}
              onClick={() => setParams(currentYear, value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
