"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

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
  zoomHint?: string;
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

export function HomeInsideClubClient({
  images,
  title,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHint,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const compositionRef = useRef<HTMLDivElement>(null);

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

  const scrollToIndex = (index: number) => {
    const el = compositionRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = images.length <= 1 ? 0 : (index / (images.length - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: "smooth" });
    setScrollIndex(index);
  };

  const mainImage = images[0];
  const secondaryImages = images.slice(1);

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
          <span className="home-inside-zoom-hint home-inside-zoom-hint--visible">
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
              <span className="home-inside-zoom-hint home-inside-zoom-hint--visible">
                <ExpandIcon />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="home-inside-dots" role="tablist" aria-label={title}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={scrollIndex === i}
            aria-label={img.alt}
            className={`home-inside-dot${scrollIndex === i ? " home-inside-dot--active" : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          closeLabel={closeLabel}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          zoomHint={zoomHint}
        />
      ) : null}
    </>
  );
}
