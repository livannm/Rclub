"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { CarouselControls } from "./CarouselControls";
import { CarouselProgress } from "./CarouselProgress";
import { EventCarouselCard } from "./EventCarouselCard";
import type { EventHighlightCardEvent } from "@/components/home/event-highlight-card";

type EventCarouselDesktop3DProps = {
  events: EventHighlightCardEvent[];
  navLabel: string;
  startsAtLabel: string;
  viewDetailsLabel: string;
  autoRotate?: boolean;
  rotateInterval?: number;
};

function getRelativeIndex(index: number, activeIndex: number, total: number) {
  let diff = index - activeIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

type SlideAnimState = { x: string; scale: number; rotateY: number; opacity: number; zIndex: number };

function getSlideAnim(rel: number): SlideAnimState {
  if (rel === 0) return { x: "0%", scale: 1, rotateY: 0, opacity: 1, zIndex: 5 };
  if (rel === -1) return { x: "-42%", scale: 0.82, rotateY: 14, opacity: 0.65, zIndex: 4 };
  if (rel === 1) return { x: "42%", scale: 0.82, rotateY: -14, opacity: 0.65, zIndex: 4 };
  if (rel === -2) return { x: "-76%", scale: 0.68, rotateY: 22, opacity: 0.32, zIndex: 3 };
  if (rel === 2) return { x: "76%", scale: 0.68, rotateY: -22, opacity: 0.32, zIndex: 3 };
  return { x: "0%", scale: 0.4, rotateY: 0, opacity: 0, zIndex: 0 };
}

export function EventCarouselDesktop3D({ events, navLabel, startsAtLabel, viewDetailsLabel, autoRotate = true, rotateInterval = 5500 }: EventCarouselDesktop3DProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = events.length;

  const goPrev = useCallback(() => setActiveIndex(cur => cur === 0 ? total - 1 : cur - 1), [total]);
  const goNext = useCallback(() => setActiveIndex(cur => cur === total - 1 ? 0 : cur + 1), [total]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !autoRotate || !isInView || isHovering || total < 2) return;
    const id = window.setInterval(goNext, rotateInterval);
    return () => window.clearInterval(id);
  }, [reducedMotion, autoRotate, isInView, isHovering, total, goNext, rotateInterval]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  const transition = reducedMotion ? { duration: 0 } : ({ duration: 0.28, ease: "easeOut" } as const);

  if (total === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={navLabel}
      className="ev-carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="ev-carousel__stage">
        <div className="ev-carousel__track">
          {events.map((event, index) => {
            const rel = getRelativeIndex(index, activeIndex, total);
            const anim = getSlideAnim(rel);
            const isActive = rel === 0;
            const isHidden = Math.abs(rel) > 2;
            return (
              <motion.div
                key={event.id}
                className="ev-carousel__slide"
                style={{ pointerEvents: isHidden ? "none" : "auto", willChange: "transform, opacity" }}
                animate={anim}
                transition={transition}
                aria-hidden={!isActive}
              >
                <EventCarouselCard event={event} startsAtLabel={startsAtLabel} viewDetailsLabel={viewDetailsLabel} isActive={isActive} />
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="ev-carousel__footer">
        <CarouselProgress total={total} activeIndex={activeIndex} onSelect={setActiveIndex} />
        {total > 1 && (
          <div className="ev-carousel__controls">
            <CarouselControls onPrev={goPrev} onNext={goNext} prevLabel={`${navLabel} — précédent`} nextLabel={`${navLabel} — suivant`} />
          </div>
        )}
      </div>
    </section>
  );
}
