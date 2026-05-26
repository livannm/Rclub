import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { buildEventDetailMetadata, buildEventJsonLd } from "@/lib/seo/metadata";
import { formatEventDateTime } from "@/lib/utils/format-date";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const event = await eventService.findBySlug(slug);

  if (!event || !event.is_published) {
    return { title: "Événement - Rclub Strasbourg" };
  }

  return buildEventDetailMetadata(event, locale);
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("EventDetail");

  const event = await eventService.findBySlug(slug);
  if (!event || !event.is_published) {
    notFound();
  }

  const localized = getLocalizedEventContent(event, locale);
  const photos = await galleryService.listEventPhotos(slug);
  const eventJsonLd = buildEventJsonLd(event, locale);

  return (
    <main className="page-shell site-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <Link href="/agenda" className="back-link">
        {t("backToAgenda")}
      </Link>

      <article className="event-detail">
        {event.cover_image_url ? (
          <figure className="event-detail-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.cover_image_url} alt={localized.title} />
          </figure>
        ) : null}

        <header className="event-detail-header">
          <p className="page-kicker">{t("kicker")}</p>
          <h1 className="page-title" data-testid="event-detail-title">
            {localized.title}
          </h1>
          <p className="event-detail-datetime">
            {formatEventDateTime(event.starts_at, locale)}
            {event.ends_at
              ? ` — ${formatEventDateTime(event.ends_at, locale)}`
              : null}
          </p>
          <p>
            {t("location")}: {event.location}
          </p>
        </header>

        <div className="event-detail-body">
          <p className="event-detail-description">{localized.description}</p>

          <div className="event-detail-actions">
            {event.ticket_url ? (
              <a className="button" href={event.ticket_url} target="_blank" rel="noreferrer">
                {t("ticket")}
              </a>
            ) : null}
            <Link
              className="button button-secondary"
              href={`/reservations?date=${event.starts_at.slice(0, 10)}`}
            >
              {t("reserve")}
            </Link>
            {photos.length > 0 ? (
              <Link className="button button-ghost" href={`/galerie/${slug}`}>
                {t("gallery")}
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
