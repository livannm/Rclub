"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export type ThreeDCarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number, activeIndex: number) => ReactNode;
  /** Accessible label for prev/next controls */
  navLabel?: string;
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
};

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return mobile;
}

function slideKey(item: unknown, index: number): string {
  if (
    item &&
    typeof item === "object" &&
    "id" in item &&
    typeof (item as { id: string }).id === "string"
  ) {
    return (item as { id: string }).id;
  }
  return String(index);
}

function slideState(
  index: number,
  active: number,
  total: number,
  compact: boolean,
) {
  if (compact) {
    return index === active ? "active" : "hidden";
  }
  if (index === active) return "active";
  if (index === (active + 1) % total) return "next";
  if (index === (active - 1 + total) % total) return "prev";
  return "hidden";
}

export function ThreeDCarousel<T>({
  items,
  renderItem,
  navLabel = "Carousel",
  autoRotate = true,
  rotateInterval = 5000,
  className = "",
}: ThreeDCarouselProps<T>) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const rootId = useId();
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  useEffect(() => {
    setActive(0);
  }, [total]);

  const goPrev = useCallback(() => {
    setActive((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (reducedMotion || !autoRotate || !isInView || isHovering || total < 2) return;
    const interval = window.setInterval(goNext, rotateInterval);
    return () => window.clearInterval(interval);
  }, [
    autoRotate,
    goNext,
    isHovering,
    isInView,
    reducedMotion,
    rotateInterval,
    total,
  ]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) goNext();
    else if (distance < -50) goPrev();
  };

  if (total === 0) return null;

  if (reducedMotion) {
    return (
      <div className={`lw-3d-carousel lw-3d-carousel--static ${className}`.trim()}>
        <div className="lw-3d-carousel__static-grid">
          {items.map((item, index) => (
            <div
              key={`${rootId}-static-${slideKey(item, index)}`}
              className="lw-3d-carousel__static-item"
            >
              {renderItem(item, index, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`lw-3d-carousel${isMobile ? " lw-3d-carousel--compact" : ""} ${className}`.trim()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="lw-3d-carousel__stage">
        {items.map((item, index) => (
          <div
            key={`${rootId}-slide-${slideKey(item, index)}`}
            className={`lw-3d-carousel__slide lw-3d-carousel__slide--${slideState(
              index,
              active,
              total,
              isMobile,
            )}`}
            aria-hidden={index !== active}
          >
            {renderItem(item, index, active)}
          </div>
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              className="lw-3d-carousel__nav lw-3d-carousel__nav--prev"
              onClick={goPrev}
              aria-label={`${navLabel} — précédent`}
            >
              <ChevronLeft aria-hidden size={18} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              className="lw-3d-carousel__nav lw-3d-carousel__nav--next"
              onClick={goNext}
              aria-label={`${navLabel} — suivant`}
            >
              <ChevronRight aria-hidden size={18} strokeWidth={1.25} />
            </button>
          </>
        ) : null}

        {total > 1 ? (
          <div className="lw-3d-carousel__dots" role="tablist" aria-label={navLabel}>
            {items.map((_, index) => (
              <button
                key={`${rootId}-dot-${index}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`${navLabel} — slide ${index + 1}`}
                className={`lw-3d-carousel__dot${index === active ? " is-active" : ""}`}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
