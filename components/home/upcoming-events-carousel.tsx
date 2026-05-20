"use client";

import dynamic from "next/dynamic";
import ShinyText from "@/components/react-bits/ShinyText";
import { ThreeDCarousel } from "@/components/lightswind/three-d-carousel";
import {
  EventHighlightCard,
  type EventHighlightCardEvent,
} from "@/components/home/event-highlight-card";
import { EventsComingSoonPlaceholder } from "@/components/home/events-coming-soon-placeholder";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const Grainient = dynamic(() => import("@/components/react-bits/Grainient"), {
  ssr: false,
});

export type UpcomingEventsCarouselProps = {
  sectionAriaLabel: string;
  sectionLabel: string;
  comingSoonLabel: string;
  comingSoonHint?: string;
  startsAtLabel: string;
  viewDetailsLabel: string;
  events: EventHighlightCardEvent[];
};

export function UpcomingEventsCarousel({
  sectionAriaLabel,
  sectionLabel,
  comingSoonLabel,
  comingSoonHint,
  startsAtLabel,
  viewDetailsLabel,
  events,
}: UpcomingEventsCarouselProps) {
  const reducedMotion = usePrefersReducedMotion();

  const panel = (
    <div className="section-panel spotlight-band home-highlight-panel">
      {!reducedMotion ? (
        <div className="home-highlight-grainient" aria-hidden="true">
          <Grainient
            color1="#0a0a0a"
            color2="#1a1510"
            color3="#2a2218"
            timeSpeed={0.12}
            grainAmount={0.08}
            warpStrength={0.35}
            saturation={0.65}
            contrast={1.05}
          />
        </div>
      ) : null}
      <div className="home-highlight-inner">
        {reducedMotion ? (
          <h2
            className="page-kicker home-highlight-kicker"
            data-testid="home-next-event-heading"
          >
            {sectionLabel}
          </h2>
        ) : (
          <h2
            className="page-kicker home-highlight-kicker"
            aria-label={sectionLabel}
            data-testid="home-next-event-heading"
          >
            <ShinyText
              text={sectionLabel}
              color="#9a8f7a"
              shineColor="#f0d878"
              speed={3.5}
              spread={92}
              pauseOnHover
            />
          </h2>
        )}
        {events.length === 0 ? (
          <EventsComingSoonPlaceholder
            label={comingSoonLabel}
            hint={comingSoonHint}
          />
        ) : (
          <ThreeDCarousel
            className="home-events-carousel"
            items={events}
            navLabel={sectionAriaLabel}
            autoRotate={events.length > 1}
            rotateInterval={5500}
            renderItem={(event, index, activeIndex) => (
              <EventHighlightCard
                event={event}
                startsAtLabel={startsAtLabel}
                viewDetailsLabel={viewDetailsLabel}
                isActive={index === activeIndex}
                testId={
                  index === 0
                    ? "home-next-event-title"
                    : `home-carousel-event-${index}`
                }
              />
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <section
      aria-label={sectionAriaLabel}
      className={`page-shell home-highlight${reducedMotion ? "" : " home-highlight-enter"}`}
      data-testid="home-upcoming-events"
    >
      {panel}
    </section>
  );
}
