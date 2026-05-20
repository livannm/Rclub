import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ClubEvent } from "@/lib/events/event-schema";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import type { AppLocale } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/locales";

export const defaultSiteUrl = "https://rclub.fr";

export type SeoPageKey =
  | "home"
  | "agenda"
  | "gallery"
  | "reservations"
  | "privatization";

export const seoPages: Record<
  SeoPageKey,
  { path: string; title: string; description: string }
> = {
  home: {
    path: "/",
    title: "Rclub Strasbourg - Club premium, soirées et événements",
    description:
      "Découvrez Rclub Strasbourg, une expérience nightlife premium avec agenda des soirées, galerie photos, réservations VIP et privatisations.",
  },
  agenda: {
    path: "/agenda",
    title: "Agenda des événements - Rclub Strasbourg",
    description:
      "Consultez les prochaines soirées et événements de Rclub Strasbourg, avec dates, informations pratiques et liens de billetterie.",
  },
  gallery: {
    path: "/galerie",
    title: "Galerie photos - Rclub Strasbourg",
    description:
      "Revivez les soirées Rclub Strasbourg avec les galeries photos des événements publiés.",
  },
  reservations: {
    path: "/reservations",
    title: "Réservations VIP - Rclub Strasbourg",
    description:
      "Envoyez votre demande de réservation pour une soirée Rclub Strasbourg ou un service VIP.",
  },
  privatization: {
    path: "/privatisation",
    title: "Privatisation - Rclub Strasbourg",
    description:
      "Privatisez Rclub Strasbourg pour un événement privé, professionnel ou une soirée sur mesure.",
  },
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function getSiteUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl);
}

export function absoluteUrl(path: string, baseUrl = getSiteUrl()) {
  const normalizedBase = trimTrailingSlash(baseUrl);
  if (path === "/") {
    return normalizedBase;
  }

  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(
  page: SeoPageKey,
  baseUrl = getSiteUrl(),
): Metadata {
  const config = seoPages[page];
  const url = absoluteUrl(config.path, baseUrl);

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName: "Rclub Strasbourg",
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

export async function buildLocalizedPageMetadata(
  page: SeoPageKey,
  baseUrl = getSiteUrl(),
): Promise<Metadata> {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations(`Seo.${page}`);
  const path = seoPages[page].path;
  const url = absoluteUrl(path, baseUrl);
  const title = t("title");
  const description = t("description");
  const openGraphLocale = locale === "en" ? "en_US" : "fr_FR";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Rclub Strasbourg",
      locale: openGraphLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildEventDetailMetadata(
  event: ClubEvent,
  locale: AppLocale,
  baseUrl = getSiteUrl(),
): Metadata {
  const localized = getLocalizedEventContent(event, locale);
  const url = absoluteUrl(`/agenda/${event.slug}`, baseUrl);
  const title = `${localized.title} - Rclub Strasbourg`;
  const description = localized.description;
  const coverUrl = event.cover_image_url.startsWith("/")
    ? absoluteUrl(event.cover_image_url, baseUrl)
    : event.cover_image_url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Rclub Strasbourg",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "article",
      images: [{ url: coverUrl, alt: localized.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverUrl],
    },
  };
}

export function buildEventGalleryMetadata(
  event: ClubEvent,
  locale: AppLocale,
  baseUrl = getSiteUrl(),
): Metadata {
  const localized = getLocalizedEventContent(event, locale);
  const url = absoluteUrl(`/galerie/${event.slug}`, baseUrl);
  const title = `${localized.title} - Galerie photos Rclub Strasbourg`;
  const description = localized.description;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Rclub Strasbourg",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "article",
      images: [
        {
          url: event.cover_image_url,
          alt: localized.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [event.cover_image_url],
    },
  };
}

export function buildOrganizationJsonLd(
  baseUrl = getSiteUrl(),
  logoUrl = "/media/logo.png",
) {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: "Rclub Strasbourg",
    url: absoluteUrl("/", baseUrl),
    logo: logoUrl.startsWith("http") ? logoUrl : absoluteUrl(logoUrl, baseUrl),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Strasbourg",
      addressCountry: "FR",
    },
  };
}

export function buildEventJsonLd(
  event: ClubEvent,
  locale: AppLocale,
  baseUrl = getSiteUrl(),
) {
  const localized = getLocalizedEventContent(event, locale);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: localized.title,
    description: localized.description,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [event.cover_image_url],
    url: absoluteUrl(`/agenda/${event.slug}`, baseUrl),
    location: {
      "@type": "Place",
      name: event.location ?? "Rclub Strasbourg",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Strasbourg",
        addressCountry: "FR",
      },
    },
    offers: event.ticket_url
      ? {
          "@type": "Offer",
          url: event.ticket_url,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}
