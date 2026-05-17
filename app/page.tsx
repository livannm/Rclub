import Link from "next/link";
import { buildEventJsonLd, buildOrganizationJsonLd, buildPageMetadata } from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { eventService } from "@/lib/events/events-service-instance";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { formatEventDateTime } from "@/lib/utils/format-date";

export const metadata = buildPageMetadata("home");

export default async function HomePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Home");
  const events = await eventService.listPublishedUpcoming();
  const nextEvent = events[0];
  const localizedNextEvent = nextEvent ? getLocalizedEventContent(nextEvent, locale) : null;

  const heroVideoUrl = await siteAssetService.getHeroVideo();
  const heroPosterUrl = await siteAssetService.getHeroPoster();
  const logoUrl = await siteAssetService.getLogo();
  const organizationJsonLd = buildOrganizationJsonLd(undefined, logoUrl);
  const nextEventJsonLd = nextEvent ? buildEventJsonLd(nextEvent, locale) : null;

  return (
    <main style={{ padding: "2rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {nextEventJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nextEventJsonLd) }}
        />
      ) : null}
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      <section aria-label="Hero video" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <video
          data-testid="hero-video"
          src={heroVideoUrl}
          poster={heroPosterUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", maxHeight: "480px", objectFit: "cover" }}
        />
      </section>

      <section
        aria-label={t("nextEventTitle")}
        style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
      >
        <h2>{t("nextEventTitle")}</h2>
        {!nextEvent || !localizedNextEvent ? (
          <p data-testid="home-next-event-empty">{t("nextEventEmpty")}</p>
        ) : (
          <article style={{ border: "1px solid #333", padding: "1rem", display: "grid", gap: "0.5rem" }}>
            <h3 data-testid="home-next-event-title">{localizedNextEvent.title}</h3>
            <p>{localizedNextEvent.description}</p>
            <p>
              {t("startsAt")}: {formatEventDateTime(nextEvent.starts_at, locale)}
            </p>
          </article>
        )}
      </section>

      <nav aria-label="Pages principales" style={{ display: "grid", gap: "0.5rem" }}>
        <Link href="/agenda">{t("agendaLink")}</Link>
        <Link href="/galerie">{t("galleryLink")}</Link>
        <Link href="/reservations">{t("reservationLink")}</Link>
        <Link href="/privatisation">{t("privatisationLink")}</Link>
        <Link href="/admin">{t("adminLink")}</Link>
      </nav>
    </main>
  );
}
