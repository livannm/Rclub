import Link from "next/link";
import {
  buildEventJsonLd,
  buildLocalizedPageMetadata,
  buildOrganizationJsonLd
} from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { eventService } from "@/lib/events/events-service-instance";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { formatEventDateTime } from "@/lib/utils/format-date";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("home");
}

export default async function HomePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Home");
  const tEvent = await getTranslations("EventDetail");
  const events = await eventService.listPublishedUpcoming();
  const nextEvent = events[0];
  const localizedNextEvent = nextEvent ? getLocalizedEventContent(nextEvent, locale) : null;

  const heroVideoUrl = await siteAssetService.getHeroVideo();
  const heroPosterUrl = await siteAssetService.getHeroPoster();
  const logoUrl = await siteAssetService.getLogo();
  const organizationJsonLd = buildOrganizationJsonLd(undefined, logoUrl);
  const nextEventJsonLd = nextEvent ? buildEventJsonLd(nextEvent, locale) : null;

  return (
    <main>
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

      <section aria-label={t("heroAriaLabel")} className="hero">
        <video
          data-testid="hero-video"
          src={heroVideoUrl}
          poster={heroPosterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        />
        <div className="hero-logo-wrap" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="" className="hero-logo" />
        </div>
        <div className="hero-content">
          <p className="page-kicker">{t("kicker")}</p>
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-lead">{t("description")}</p>
          <div className="hero-actions">
            <Link className="button" href="/reservations">
              {t("reservationLink")}
            </Link>
            <Link className="button button-secondary" href="/agenda">
              {t("agendaLink")}
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label={t("nextEventTitle")}
        className="page-shell home-highlight"
      >
        <div className="section-panel spotlight-band">
          <p className="page-kicker">{t("nextEventTitle")}</p>
          {!nextEvent || !localizedNextEvent ? (
            <p data-testid="home-next-event-empty">{t("nextEventEmpty")}</p>
          ) : (
            <article className="event-card event-card-interactive">
              <Link href={`/agenda/${nextEvent.slug}`} className="event-card-hit-area">
                {nextEvent.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nextEvent.cover_image_url}
                    alt={localizedNextEvent.title}
                    loading="lazy"
                    className="event-card-image"
                  />
                ) : null}
                <h2 data-testid="home-next-event-title">{localizedNextEvent.title}</h2>
                <p>{localizedNextEvent.description}</p>
                <p>
                  {t("startsAt")}: {formatEventDateTime(nextEvent.starts_at, locale)}
                </p>
                <span className="event-card-cta">{tEvent("viewDetails")} →</span>
              </Link>
            </article>
          )}
        </div>
      </section>

    </main>
  );
}
