"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomHint?: string;
};

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

export function GalleryLightbox({
  images,
  initialIndex = 0,
  onClose,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHint,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const activeImage = images[index];

  const centerImage = useCallback(() => {
    requestAnimationFrame(() => transformRef.current?.centerView(1, 0));
  }, []);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setScale(1);
  }, [index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (scale === 1) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };

    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next, scale]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (scale > 1 || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  if (!activeImage || !mounted) return null;

  return createPortal(
    <div
      className="inside-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.alt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="inside-lightbox-backdrop" onClick={onClose} aria-hidden="true" />

      <button
        type="button"
        className="inside-lightbox-close"
        onClick={onClose}
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
          disabled={scale > 1}
        >
          <ChevronLeft />
        </button>

        <div className="inside-lightbox-img-wrap inside-lightbox-img-wrap--zoom">
          <TransformWrapper
            key={activeImage.src}
            ref={transformRef}
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
            centerZoomedOut
            limitToBounds
            onInit={centerImage}
            onTransform={(_ref, state) => setScale(state.scale)}
            panning={{ disabled: scale <= 1 }}
            doubleClick={{ mode: "toggle", step: 0.7 }}
          >
            <TransformComponent
              wrapperClass="inside-lightbox-zoom-wrapper"
              contentClass="inside-lightbox-zoom-content"
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="inside-lightbox-img"
                draggable={false}
                onLoad={centerImage}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        <button
          type="button"
          className="inside-lightbox-nav inside-lightbox-nav--next"
          onClick={next}
          aria-label={nextLabel}
          disabled={scale > 1}
        >
          <ChevronRight />
        </button>
      </div>

      <p className="inside-lightbox-counter" aria-live="polite">
        {index + 1} / {images.length}
        {zoomHint ? <span className="inside-lightbox-zoom-hint">{zoomHint}</span> : null}
      </p>
    </div>,
    document.body
  );
}
