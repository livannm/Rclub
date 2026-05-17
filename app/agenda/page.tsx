import { eventService } from "@/lib/events/events-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { resolveLocale } from "@/i18n/locales";
import { formatEventDateTime } from "@/lib/utils/format-date";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AgendaPage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Agenda");
  const events = await eventService.listPublishedUpcoming();

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>{t("title")}</h1>
      {events.length === 0 ? <p data-testid="agenda-empty">{t("empty")}</p> : null}

      {events.map((event, index) => {
        const localized = getLocalizedEventContent(event, locale);

        return (
          <article key={event.id} style={{ border: "1px solid #333", padding: "1rem" }}>
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
                <a href={event.ticket_url}>{t("ticket")}</a>
              </p>
            ) : null}
          </article>
        );
      })}
    </main>
  );
}
