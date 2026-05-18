import Link from "next/link";
import type { ClubEvent } from "@/lib/events/event-schema";
import type { AppLocale } from "@/i18n/locales";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { formatEventDateTime } from "@/lib/utils/format-date";

type EventCardProps = {
  event: ClubEvent;
  locale: AppLocale;
  index?: number;
  startsAtLabel: string;
  locationLabel: string;
  ticketLabel: string;
  detailsLabel: string;
  showTicket?: boolean;
};

export function EventCard({
  event,
  locale,
  index,
  startsAtLabel,
  locationLabel,
  ticketLabel,
  detailsLabel,
  showTicket = true
}: EventCardProps) {
  const localized = getLocalizedEventContent(event, locale);
  const d = new Date(event.starts_at);
  const eventDay = String(d.getDate()).padStart(2, "0");
  const eventMonth = d
    .toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { month: "short" })
    .toUpperCase();

  return (
    <article id={event.slug} className="event-card event-card-interactive">
      <Link href={`/agenda/${event.slug}`} className="event-card-hit-area">
        <div className="event-date-badge" aria-hidden="true">
          <span className="event-date-day">{eventDay}</span>
          <span className="event-date-month">{eventMonth}</span>
        </div>
        {event.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_image_url}
            alt={localized.title}
            loading="lazy"
            className="event-card-image"
          />
        ) : null}
        <h2 data-testid={index !== undefined ? `agenda-event-title-${index}` : undefined}>
          {localized.title}
        </h2>
        <p className="event-card-excerpt">{localized.description}</p>
        <p>
          {startsAtLabel}: {formatEventDateTime(event.starts_at, locale)}
        </p>
        <p>
          {locationLabel}: {event.location}
        </p>
        <span className="event-card-cta">{detailsLabel} →</span>
      </Link>
      {showTicket && event.ticket_url ? (
        <p className="event-card-ticket">
          <a className="button button-ghost" href={event.ticket_url} target="_blank" rel="noreferrer">
            {ticketLabel}
          </a>
        </p>
      ) : null}
    </article>
  );
}
