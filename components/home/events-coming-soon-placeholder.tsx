"use client";

import ShinyText from "@/components/react-bits/ShinyText";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export type EventsComingSoonPlaceholderProps = {
  label: string;
  hint?: string;
};

export function EventsComingSoonPlaceholder({
  label,
  hint,
}: EventsComingSoonPlaceholderProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="home-events-placeholder" data-testid="home-next-event-empty">
      <div className="home-events-placeholder__frame" aria-hidden="true" />
      <div className="home-events-placeholder__content">
        {reducedMotion ? (
          <p className="home-events-placeholder__label">{label}</p>
        ) : (
          <p className="home-events-placeholder__label" aria-label={label}>
            <ShinyText
              text={label}
              color="#8a7f6c"
              shineColor="#f0d878"
              speed={4}
              spread={88}
            />
          </p>
        )}
        {hint ? <p className="home-events-placeholder__hint">{hint}</p> : null}
      </div>
    </div>
  );
}
