import {
  buildEventJsonLd,
  buildLocalizedPageMetadata,
  buildOrganizationJsonLd
} from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { getEventService } from "@/lib/events/events-service-instance";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { formatEventDateTime } from "@/lib/utils/format-date";
import { HeroCinematic } from "@/components/home/hero-cinematic";
import { UpcomingEventsCarousel } from "@/components/home/upcoming-events-carousel";
import { HomeBelowCarousel } from "@/components/home/sections/HomeBelowCarousel";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("home");
}

export default async function HomePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Home");
  const tEvent = await getTranslations("EventDetail");
  const events = await getEventService().listPublishedUpcoming();
  const upcomingEvents = events.slice(0, 4);
  const nextEvent = upcomingEvents[0];
  const localizedUpcomingEvents = upcomingEvents.map((event) => ({
    event,
    localized: getLocalizedEventContent(event, locale),
  }));

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

      <HeroCinematic
        heroAriaLabel={t("heroAriaLabel")}
        title={t("title")}
        reservationLabel={t("reservationLink")}
        agendaLabel={t("agendaLink")}
        heroVideoUrl={heroVideoUrl}
        heroPosterUrl={heroPosterUrl}
      />

      <UpcomingEventsCarousel
        sectionAriaLabel={t("upcomingEventsTitle")}
        sectionLabel={t("upcomingEventsTitle")}
        comingSoonLabel={t("comingSoonLabel")}
        comingSoonHint={t("comingSoonHint")}
        startsAtLabel={t("startsAt")}
        viewDetailsLabel={tEvent("viewDetails")}
        reserveLabel={tEvent("reserve")}
        events={localizedUpcomingEvents.map(({ event, localized }) => ({
          id: event.id,
          slug: event.slug,
          title: localized.title,
          startsAtFormatted: formatEventDateTime(event.starts_at, locale),
          startsAtIso: event.starts_at,
          coverImageUrl: event.cover_image_url,
        }))}
      />

      <HomeBelowCarousel />
    </main>
  );
}
