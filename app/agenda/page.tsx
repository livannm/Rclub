import { buildPageMetadata } from "@/lib/seo/metadata";
import { eventService } from "@/lib/events/events-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { resolveLocale } from "@/i18n/locales";
import { formatEventDateTime } from "@/lib/utils/format-date";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata = buildPageMetadata("agenda");

export default async function AgendaPage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Agenda");
  const events = await eventService.listPublishedUpcoming();

  return (
    <main className="page-shell site-grid">
      <p className="page-kicker">Rclub</p>
      <h1>{t("title")}</h1>
      {events.length === 0 ? <p data-testid="agenda-empty">{t("empty")}</p> : null}

      <section className="card-grid" aria-label={t("title")}>
        {events.map((event, index) => {
          const localized = getLocalizedEventContent(event, locale);

          return (
            <article id={event.slug} key={event.id} className="event-card">
              {event.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.cover_image_url}
                  alt={localized.title}
                  loading="lazy"
                  className="event-card-image"
                />
              ) : null}
              <h2 data-testid={`agenda-event-title-${index}`}>{localized.title}</h2>
              <p>{localized.description}</p>
              <p>
                {t("startsAt")}: {formatEventDateTime(event.starts_at, locale)}
              </p>
              <p>
                {t("location")}: {event.location}
              </p>
              {event.ticket_url ? (
                <p>
                  <a className="button button-ghost" href={event.ticket_url}>
                    {t("ticket")}
                  </a>
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
