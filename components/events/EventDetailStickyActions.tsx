"use client";

type Props = {
  ticketUrl?: string | null;
  ticketLabel: string;
  reserveHref: string;
  reserveLabel: string;
  galleryHref?: string | null;
  galleryLabel?: string;
};

export function EventDetailStickyActions({
  ticketUrl,
  ticketLabel,
  reserveHref,
  reserveLabel,
  galleryHref,
  galleryLabel,
}: Props) {
  return (
    <div className="event-detail-sticky-cta" aria-hidden={false}>
      <div className="event-detail-sticky-cta-inner">
        {ticketUrl ? (
          <a className="button" href={ticketUrl} target="_blank" rel="noreferrer">
            {ticketLabel}
          </a>
        ) : null}
        <a className="button button-secondary" href={reserveHref}>
          {reserveLabel}
        </a>
        {galleryHref && galleryLabel ? (
          <a className="button button-ghost event-detail-sticky-cta-gallery" href={galleryHref}>
            {galleryLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
