import { Suspense } from "react";
import { EventCard } from "@/components/event-card";
import { AgendaFilters } from "@/components/agenda/AgendaFilters";
import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { eventService } from "@/lib/events/events-service-instance";
import { resolveLocale } from "@/i18n/locales";
import { getClubEveningParts } from "@/lib/utils/club-date";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("agenda");
}

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string; past?: string }>;
};

export default async function AgendaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Agenda");
  const tDetail = await getTranslations("EventDetail");

  const allEvents = await eventService.listPublished();
  const now = new Date();

  const selectedYear = params.year ? parseInt(params.year, 10) : null;
  const selectedMonth = params.month ? parseInt(params.month, 10) : null;
  const showPast = params.past === "1";

  // Available years from all events (club evening date = start of the night)
  const years = [
    ...new Set(allEvents.map((e) => getClubEveningParts(e.starts_at).year)),
  ].sort((a, b) => a - b);

  // Available months per year
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const monthsByYear: Record<number, { value: number; label: string }[]> = {};
  for (const year of years) {
    const monthNums = [
      ...new Set(
        allEvents
          .filter((e) => getClubEveningParts(e.starts_at).year === year)
          .map((e) => getClubEveningParts(e.starts_at).month)
      ),
    ].sort((a, b) => a - b);

    monthsByYear[year] = monthNums.map((m) => ({
      value: m,
      label: new Date(year, m - 1, 1).toLocaleDateString(intlLocale, { month: "long" }),
    }));
  }

  // Filter events
  let filtered = allEvents;
  if (!showPast) {
    filtered = filtered.filter((e) => new Date(e.starts_at) >= now);
  }
  if (selectedYear != null) {
    filtered = filtered.filter((e) => getClubEveningParts(e.starts_at).year === selectedYear);
  }
  if (selectedMonth != null) {
    filtered = filtered.filter((e) => getClubEveningParts(e.starts_at).month === selectedMonth);
  }

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
    </main>
  );
}
