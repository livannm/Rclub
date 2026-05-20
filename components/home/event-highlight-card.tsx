"use client";

import Link from "next/link";
import SpotlightCard from "@/components/react-bits/SpotlightCard";

export type EventHighlightCardEvent = {
  id: string;
  slug: string;
  title: string;
  startsAtFormatted: string;
  coverImageUrl: string | null;
};

export type EventHighlightCardProps = {
  event: EventHighlightCardEvent;
  startsAtLabel: string;
  viewDetailsLabel: string;
  isActive?: boolean;
  testId?: string;
};

export function EventHighlightCard({
  event,
  startsAtLabel,
  viewDetailsLabel,
  isActive = false,
  testId,
}: EventHighlightCardProps) {
  return (
    <SpotlightCard
      className={`home-event-card${isActive ? " is-active" : ""}`}
      spotlightColor="rgba(212, 175, 55, 0.16)"
    >
      <article className="home-event-card__article">
        <Link
          href={`/agenda/${event.slug}`}
          className="home-event-card__link"
          tabIndex={isActive ? 0 : -1}
        >
          <div className="home-event-card__media">
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt=""
                className="home-event-card__image"
                loading={isActive ? "eager" : "lazy"}
              />
            ) : (
              <span className="home-event-card__media-fallback" aria-hidden>
                R
              </span>
            )}
            <div className="home-event-card__media-scrim" aria-hidden />
            <p className="home-event-card__date">
              <span className="home-event-card__date-label">{startsAtLabel}</span>
              <time>{event.startsAtFormatted}</time>
            </p>
          </div>
          <div className="home-event-card__body">
            <h3 className="home-event-card__title" data-testid={testId}>
              {event.title}
            </h3>
            <span className="home-event-card__cta">{viewDetailsLabel} →</span>
          </div>
        </Link>
      </article>
    </SpotlightCard>
  );
}
