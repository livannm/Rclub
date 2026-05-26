"use client";
import Link from "next/link";
import type { EventHighlightCardEvent } from "@/components/home/event-highlight-card";

type EventCarouselCardProps = {
  event: EventHighlightCardEvent;
  startsAtLabel: string;
  viewDetailsLabel: string;
  reserveLabel: string;
  isActive?: boolean;
  onNavigate?: () => void;
};

export function EventCarouselCard({ event, startsAtLabel, viewDetailsLabel, reserveLabel, isActive = false, onNavigate }: EventCarouselCardProps) {
  const href = `/agenda/${event.slug}`;
  const reserveHref = `/reservations?date=${event.startsAtIso.slice(0, 10)}`;
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${event.title}, ${event.startsAtFormatted}`}
      className="ev-carousel__card"
    >
      {!isActive && onNavigate && (
        <button
          type="button"
          className="ev-carousel__card-overlay"
          onClick={onNavigate}
          aria-label={event.title}
          tabIndex={-1}
        />
      )}
      {event.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverImageUrl} alt="" className="ev-carousel__card-img" loading={isActive ? "eager" : "lazy"} />
      ) : (
        <div className="ev-carousel__card-fallback" aria-hidden><span>R</span></div>
      )}
      <div className="ev-carousel__card-scrim" aria-hidden />
      <div className="ev-carousel__card-gradient" aria-hidden />
      <div className="ev-carousel__card-inner">
        <div className="ev-carousel__card-logo" aria-hidden>R</div>
        <div className="ev-carousel__card-content">
          <p className="ev-carousel__card-label">{startsAtLabel}</p>
          <h3 className="ev-carousel__card-title">{event.title}</h3>
          <p className="ev-carousel__card-date">{event.startsAtFormatted}</p>
          <Link
            href={href}
            tabIndex={isActive ? 0 : -1}
            aria-hidden={!isActive}
            className="ev-carousel__card-cta"
          >
            {viewDetailsLabel}
          </Link>
          <Link
            href={reserveHref}
            tabIndex={isActive ? 0 : -1}
            aria-hidden={!isActive}
            className="ev-carousel__card-reserve"
          >
            {reserveLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
