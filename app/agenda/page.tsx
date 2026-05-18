import { EventCard } from "@/components/event-card";
import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { eventService } from "@/lib/events/events-service-instance";
import { resolveLocale } from "@/i18n/locales";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("agenda");
}

export default async function AgendaPage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Agenda");
  const tDetail = await getTranslations("EventDetail");
  const events = await eventService.listPublishedUpcoming();

  return (
    <main className="page-shell site-grid">
      <p className="page-kicker">Rclub</p>
      <h1 className="page-title">{t("title")}</h1>
      {events.length === 0 ? <p data-testid="agenda-empty">{t("empty")}</p> : null}

      <section className="card-grid" aria-label={t("title")}>
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            locale={locale}
            index={index}
            startsAtLabel={t("startsAt")}
            locationLabel={t("location")}
            ticketLabel={t("ticket")}
            detailsLabel={tDetail("viewDetails")}
          />
        ))}
      </section>
    </main>
  );
}
