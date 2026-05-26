"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

const DARK_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxNzE3MTciLz48L3N2Zz4=";

interface ClubImage {
  src: string;
  alt: string;
}

interface Props {
  images: ClubImage[];
  title: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HomeInsideClubClient({
  images,
  title,
  closeLabel,
  prevLabel,
  nextLabel,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const compositionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Track which photo is visible in the scroll strip
  useEffect(() => {
    const el = compositionRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const progress = el.scrollLeft / maxScroll;
      const idx = Math.round(progress * (images.length - 1));
      setScrollIndex(Math.max(0, Math.min(idx, images.length - 1)));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  // Lightbox keyboard navigation
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : 0)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  // Touch swipe in lightbox
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  const mainImage = images[0];
  const secondaryImages = images.slice(1);
  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <div ref={compositionRef} className="home-inside-composition">
        <button
          type="button"
          className="home-inside-main home-inside-clickable"
          onClick={() => setLightboxIndex(0)}
          aria-label={mainImage.alt}
        >
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            width={1200}
            height={750}
            className="home-inside-main-image"
            sizes="(max-width: 767px) 82vw, 66vw"
            placeholder="blur"
            blurDataURL={DARK_BLUR_PLACEHOLDER}
          />
          <div className="home-inside-main-overlay" aria-hidden="true" />
          <div className="home-inside-main-text">
            <h2 className="home-inside-main-title">{title}</h2>
          </div>
          <span className="home-inside-zoom-hint">
            <ExpandIcon />
          </span>
        </button>

        <div className="home-inside-secondaries">
          {secondaryImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="home-inside-secondary home-inside-clickable"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={img.alt}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={600}
                className="home-inside-secondary-image"
                sizes="(max-width: 767px) 82vw, 33vw"
                placeholder="blur"
                blurDataURL={DARK_BLUR_PLACEHOLDER}
              />
              <span className="home-inside-zoom-hint">
                <ExpandIcon />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dot indicators — visible on mobile only */}
      <div className="home-inside-dots" aria-hidden="true">
        {images.map((_, i) => (
          <span
            key={i}
            className={`home-inside-dot${scrollIndex === i ? " home-inside-dot--active" : ""}`}
          />
        ))}
      </div>

      {lightboxIndex !== null && activeImage && (
        <div
          className="inside-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <div className="inside-lightbox-backdrop" onClick={close} aria-hidden="true" />

          <button
            type="button"
            className="inside-lightbox-close"
            onClick={close}
            aria-label={closeLabel}
          >
            <CloseIcon />
          </button>

          <div className="inside-lightbox-content">
            <button
              type="button"
              className="inside-lightbox-nav inside-lightbox-nav--prev"
              onClick={prev}
              aria-label={prevLabel}
            >
              <ChevronLeft />
            </button>

            <div className="inside-lightbox-img-wrap">
              <Image
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                width={1600}
                height={1000}
                className="inside-lightbox-img"
                sizes="(max-width: 767px) 90vw, 85vw"
                priority
              />
            </div>

            <button
              type="button"
              className="inside-lightbox-nav inside-lightbox-nav--next"
              onClick={next}
              aria-label={nextLabel}
            >
              <ChevronRight />
            </button>
          </div>

          <p className="inside-lightbox-counter" aria-live="polite">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
