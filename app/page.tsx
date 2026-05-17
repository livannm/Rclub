import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { eventService } from "@/lib/events/events-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";

export default async function HomePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Home");
  const events = await eventService.listPublishedUpcoming();
  const nextEvent = events[0];
  const localizedNextEvent = nextEvent ? getLocalizedEventContent(nextEvent, locale) : null;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      <section aria-label={t("nextEventTitle")} style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
        <h2>{t("nextEventTitle")}</h2>
        {!nextEvent ? <p data-testid="home-next-event-empty">{t("nextEventEmpty")}</p> : null}
        {nextEvent && localizedNextEvent ? (
          <article style={{ border: "1px solid #333", padding: "1rem", display: "grid", gap: "0.5rem" }}>
            <h3 data-testid="home-next-event-title">{localizedNextEvent.title}</h3>
            <p>{localizedNextEvent.description}</p>
            <p>
              {t("startsAt")}:{" "}
              {new Date(nextEvent.starts_at).toLocaleString(locale === "en" ? "en-US" : "fr-FR")}
            </p>
          </article>
        ) : null}
      </section>

      <p>
        <a href="/admin">{t("adminLink")}</a>
      </p>
      <p>
        <a href="/agenda">{t("agendaLink")}</a>
      </p>
    </main>
  );
}
