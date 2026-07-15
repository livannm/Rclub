"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { EventHighlightCardEvent } from "@/components/home/event-highlight-card";
import { CarouselControls } from "./CarouselControls";

type EventCarouselMobileImmersiveProps = {
  events: EventHighlightCardEvent[];
  navLabel: string;
  startsAtLabel: string;
  viewDetailsLabel: string;
  reserveLabel: string;
};

export function EventCarouselMobileImmersive({ events, navLabel, startsAtLabel, viewDetailsLabel, reserveLabel }: EventCarouselMobileImmersiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = events.length;

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement | undefined;
    if (!slide) return;
    container.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const goPrev = useCallback(() => scrollToIndex(activeIndex === 0 ? total - 1 : activeIndex - 1), [activeIndex, total, scrollToIndex]);
  const goNext = useCallback(() => scrollToIndex(activeIndex === total - 1 ? 0 : activeIndex + 1), [activeIndex, total, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(Math.round(container.scrollLeft / container.clientWidth));
  }, []);

  if (total === 0) return null;

  return (
    <section aria-roledescription="carousel" aria-label={navLabel} className="ev-carousel-mobile">
      <div className="ev-carousel-mobile__progress">
        {events.map((event, index) => (
          <button
            key={event.id}
            type="button"
            aria-label={`${navLabel} — slide ${index + 1}`}
            aria-selected={index === activeIndex}
            onClick={() => scrollToIndex(index)}
            className="ev-carousel-mobile__progress-tick"
          >
            <span className="ev-carousel-mobile__progress-track" />
            <span
              className="ev-carousel-mobile__progress-fill"
              style={{ width: index <= activeIndex ? "100%" : "0%" }}
            />
          </button>
        ))}
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="ev-carousel-mobile__scroll">
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          const href = `/agenda/${event.slug}`;
          const reserveHref = `/reservations?date=${event.startsAtIso.slice(0, 10)}`;
          return (
            <article
              key={event.id}
              aria-roledescription="slide"
              aria-label={`${event.title}, ${event.startsAtFormatted}`}
              aria-hidden={!isActive}
              className="ev-carousel-mobile__slide"
            >
              {event.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.coverImageUrl} alt="" className="ev-carousel-mobile__img" loading={index === 0 ? "eager" : "lazy"} />
              ) : (
                <div className="ev-carousel-mobile__fallback" aria-hidden><span>R</span></div>
              )}
              <div className="ev-carousel-mobile__scrim" aria-hidden />
              <div className="ev-carousel-mobile__gradient" aria-hidden />
              <div className="ev-carousel-mobile__body">
                <div className="ev-carousel-mobile__logo" aria-hidden>R</div>
                <div className="ev-carousel-mobile__content">
                  <p className="ev-carousel-mobile__label">{startsAtLabel}</p>
                  <h2 className="ev-carousel-mobile__title">{event.title}</h2>
                  <p className="ev-carousel-mobile__date">{event.startsAtFormatted}</p>
                  <Link href={href} tabIndex={isActive ? 0 : -1} className="button ev-carousel-mobile__cta">
                    {viewDetailsLabel}
                  </Link>
                  <Link href={reserveHref} tabIndex={isActive ? 0 : -1} className="button button-secondary ev-carousel-mobile__reserve">
                    {reserveLabel}
                  </Link>
                  <p className="ev-carousel-mobile__counter">
                    <span className="ev-carousel-mobile__counter-index">{String(activeIndex + 1).padStart(2, "0")}</span>
                    {" / "}
                    {String(total).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {total > 1 && (
        <div className="ev-carousel-mobile__nav">
          <CarouselControls onPrev={goPrev} onNext={goNext} prevLabel={`${navLabel} — précédent`} nextLabel={`${navLabel} — suivant`} />
        </div>
      )}
    </section>
  );
}
