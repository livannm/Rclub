import { Suspense } from "react";
import { EventCard } from "@/components/event-card";
import { AgendaFilters } from "@/components/agenda/AgendaFilters";
import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { eventService } from "@/lib/events/events-service-instance";
import { resolveLocale } from "@/i18n/locales";
import { getClubEveningParts } from "@/lib/utils/club-date";
import { getLocale, getTranslations } from "next-intl/server";
import { Pagination } from "@/components/Pagination";
import { parsePage } from "@/lib/utils/pagination";
import { parseAgendaYear, parseAgendaMonth } from "@/lib/events/agenda-query";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("agenda");
}

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string; past?: string; page?: string }>;
};

export default async function AgendaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Agenda");
  const tDetail = await getTranslations("EventDetail");

  const now = new Date();

  const selectedYear = parseAgendaYear(params.year);
  const selectedMonth = selectedYear ? parseAgendaMonth(params.month) : null;
  const showPast = params.past === "1";
  const [dates, result] = await Promise.all([
    eventService.listPublishedDates(),
    eventService.listAgenda({ showPast, year: selectedYear, month: selectedMonth, page: parsePage(params.page), now }),
  ]);

  // Available years from all events (club evening date = start of the night)
  const years = [
    ...new Set(dates.map(date => getClubEveningParts(date).year)),
  ].sort((a, b) => a - b);

  // Available months per year
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const monthsByYear: Record<number, { value: number; label: string }[]> = {};
  for (const year of years) {
    const monthNums = [
      ...new Set(
        dates
          .filter(date => getClubEveningParts(date).year === year)
          .map(date => getClubEveningParts(date).month)
      ),
    ].sort((a, b) => a - b);

    monthsByYear[year] = monthNums.map((m) => ({
      value: m,
      label: new Date(year, m - 1, 1).toLocaleDateString(intlLocale, { month: "long" }),
    }));
  }

  const filtered = result.items;
  const query: Record<string, string> = {};
  if (showPast) query.past = "1";
  if (selectedYear) query.year = String(selectedYear);
  if (selectedMonth) query.month = String(selectedMonth);
  const isFiltered = selectedYear != null || selectedMonth != null;

  return (
    <main className="page-shell site-grid">
      <p className="page-kicker">{t("kicker")}</p>
      <h1 className="page-title">{t("title")}</h1>

      {years.length > 0 && (
        <Suspense>
          <AgendaFilters
            years={years}
            monthsByYear={monthsByYear}
            currentYear={selectedYear}
            currentMonth={selectedMonth}
            showPast={showPast}
            labelAll={t("filterAll")}
            labelShowPast={t("showPast")}
          />
        </Suspense>
      )}

      {filtered.length === 0 ? (
        <p className="agenda-empty">{isFiltered ? t("emptyFiltered") : t("empty")}</p>
      ) : (
        <section className="card-grid" aria-label={t("title")}>
          {filtered.map((event, index) => {
            const isPast = new Date(event.starts_at) < now;
            return (
              <EventCard
                key={event.id}
                event={event}
                locale={locale}
                index={index}
                isPast={isPast}
                startsAtLabel={t("startsAt")}
                locationLabel={t("location")}
                ticketLabel={t("ticket")}
                detailsLabel={tDetail("viewDetails")}
                pastLabel={t("pastBadge")}
              />
            );
          })}
        </section>
      )}
      {showPast ? <Pagination path="/agenda" query={query} page={result.page} totalPages={result.totalPages} /> : null}
    </main>
  );
}
