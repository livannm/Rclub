import Link from "next/link";
import type { ClubEvent } from "@/lib/events/event-schema";
import type { AppLocale } from "@/i18n/locales";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { formatClubEveningBadge, formatEventDateTime } from "@/lib/utils/format-date";

type EventCardProps = {
  event: ClubEvent;
  locale: AppLocale;
  index?: number;
  isPast?: boolean;
  pastLabel?: string;
  startsAtLabel?: string;
  locationLabel?: string;
  ticketLabel: string;
  detailsLabel: string;
  showTicket?: boolean;
};

export function EventCard({
  event,
  locale,
  index,
  isPast = false,
  pastLabel,
  ticketLabel,
  detailsLabel,
  showTicket = true
}: EventCardProps) {
  const localized = getLocalizedEventContent(event, locale);
  const { day: eventDay, month: eventMonth } = formatClubEveningBadge(event.starts_at, locale);

  return (
    <article id={event.slug} className={`event-card event-card-interactive${isPast ? " event-card--past" : ""}`}>
      <Link href={`/agenda/${event.slug}`} className="event-card-hit-area">
        <div className="event-date-badge" aria-hidden="true">
          <span className="event-date-day">{eventDay}</span>
          <span className="event-date-month">{eventMonth}</span>
        </div>
        {event.cover_image_url ? (
          <div className="event-card-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.cover_image_url}
              alt={localized.title}
              loading="lazy"
              className="event-card-image"
            />
            {isPast && pastLabel ? (
              <span className="event-card-past-badge">{pastLabel}</span>
            ) : null}
          </div>
        ) : null}
        <h2 data-testid={index !== undefined ? `agenda-event-title-${index}` : undefined}>
          {localized.title}
        </h2>
        <p className="event-card-excerpt">{localized.description}</p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: "0.35em" }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatEventDateTime(event.starts_at, locale)}
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
