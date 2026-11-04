import { datetimeLocalParisToIso } from "@/lib/utils/club-date";
import { EVENT_PAGE_SIZE, parsePage } from "@/lib/utils/pagination";
import type { EventListQuery } from "@/lib/events/event-repository";

export type AgendaOptions = {
  showPast: boolean;
  page?: number;
  year?: number | null;
  month?: number | null;
  now?: Date;
};

export function parseAgendaYear(value: unknown): number | null {
  const year = typeof value === "string" && /^\d{4}$/.test(value) ? Number(value) : value;
  return typeof year === "number" && Number.isInteger(year) && year >= 1900 && year < 9999 ? year : null;
}

export function parseAgendaMonth(value: unknown): number | null {
  const month = typeof value === "string" && /^\d{1,2}$/.test(value) ? Number(value) : value;
  return typeof month === "number" && Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

export function buildAgendaQuery(options: AgendaOptions): EventListQuery {
  const year = parseAgendaYear(options.year);
  const month = year ? parseAgendaMonth(options.month) : null;
  // The club's night runs noon-to-noon in Paris, including nights after midnight.
  const startMonth = month ?? 1;
  const endMonth = month && month < 12 ? month + 1 : 1;
  const endYear = year ? (month && month < 12 ? year : year + 1) : 0;
  const range = year ? {
    startsAtFrom: datetimeLocalParisToIso(`${year}-${String(startMonth).padStart(2, "0")}-01T12:00`),
    startsAtTo: datetimeLocalParisToIso(`${endYear}-${String(endMonth).padStart(2, "0")}-01T12:00`),
  } : {};
  const now = (options.now ?? new Date()).toISOString();
  return {
    ...range,
    startsAtFrom: options.showPast ? range.startsAtFrom :
      range.startsAtFrom && range.startsAtFrom > now ? range.startsAtFrom : now,
    descending: options.showPast,
    page: options.showPast ? parsePage(options.page) : 1,
    pageSize: options.showPast ? EVENT_PAGE_SIZE : undefined,
  };
}
