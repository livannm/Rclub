"use client";

import { useEffect, useState } from "react";
import { EventCarouselDesktop3D } from "./EventCarouselDesktop3D";
import { EventCarouselMobileImmersive } from "./EventCarouselMobileImmersive";
import type { EventHighlightCardEvent } from "@/components/home/event-highlight-card";

export type EventCarouselProps = {
  events: EventHighlightCardEvent[];
  navLabel: string;
  startsAtLabel: string;
  viewDetailsLabel: string;
  reserveLabel: string;
  autoRotate?: boolean;
  rotateInterval?: number;
};

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isDesktop;
}

export function EventCarousel({
  events,
  navLabel,
  startsAtLabel,
  viewDetailsLabel,
  reserveLabel,
  autoRotate,
  rotateInterval,
}: EventCarouselProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <EventCarouselDesktop3D
        events={events}
        navLabel={navLabel}
        startsAtLabel={startsAtLabel}
        viewDetailsLabel={viewDetailsLabel}
        reserveLabel={reserveLabel}
        autoRotate={autoRotate}
        rotateInterval={rotateInterval}
      />
    );
  }

  return (
    <EventCarouselMobileImmersive
      events={events}
      navLabel={navLabel}
      startsAtLabel={startsAtLabel}
      viewDetailsLabel={viewDetailsLabel}
      reserveLabel={reserveLabel}
    />
  );
}
