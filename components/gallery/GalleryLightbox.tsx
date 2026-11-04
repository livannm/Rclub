"use client";

import { MediaImage } from "@/components/media/MediaImage";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
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
  imageOffset?: number;
  totalImages?: number;
  loadImage?: (index: number) => Promise<GalleryImage>;
  loadingLabel?: string;
  errorLabel?: string;
  retryLabel?: string;
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

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function GalleryLightbox(props: Props) {
  return <LightboxContent key={props.initialIndex ?? 0} {...props} />;
}

function LightboxContent({
  images,
  initialIndex = 0,
  onClose,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHint,
  imageOffset = 0,
  totalImages = images.length,
  loadImage,
  loadingLabel,
  errorLabel,
  retryLabel,
}: Props) {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const t = useTranslations("Gallery");
  const loadingText = loadingLabel ?? t("loading");
  const errorText = errorLabel ?? t("loadError");
  const retryText = retryLabel ?? t("retry");
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [remoteImage, setRemoteImage] = useState<{ index: number; image?: GalleryImage; error?: boolean } | null>(null);
  const [retry, setRetry] = useState(0);

  const localImage = images[index - imageOffset];
  const activeImage = localImage ?? (remoteImage?.index === index ? remoteImage.image : undefined);
  const failed = !localImage && remoteImage?.index === index && remoteImage.error;

  useEffect(() => {
    if (localImage || !loadImage) return;
    let cancelled = false;
    loadImage(index).then(image => {
      if (!cancelled) setRemoteImage({ index, image });
    }).catch(() => {
      if (!cancelled) setRemoteImage({ index, error: true });
    });
    return () => { cancelled = true; };
  }, [index, loadImage, localImage, retry]);

  const centerImage = useCallback(() => {
    requestAnimationFrame(() => transformRef.current?.centerView(1, 0));
  }, []);

  const prev = useCallback(
    () => { setScale(1); setIndex((i) => (i - 1 + totalImages) % totalImages); },
    [totalImages]
  );
  const next = useCallback(
    () => { setScale(1); setIndex((i) => (i + 1) % totalImages); },
    [totalImages]
  );

  useEffect(() => {
    if (!mounted) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { previousFocus?.focus(); };
  }, [mounted]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        if (buttons?.length) {
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      if (scale === 1) {
        if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      }
    };

    document.addEventListener("keydown", handler);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previousOverflow;
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

  if (!mounted || totalImages === 0) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="inside-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={activeImage?.alt || loadingText}
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
          {activeImage ? <TransformWrapper
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
              <MediaImage
                src={activeImage.src}
                alt={activeImage.alt}
                className="inside-lightbox-img"
                draggable={false}
                loading="eager"
                onLoad={centerImage}
              />
            </TransformComponent>
          </TransformWrapper> : (
            <div className="lightbox-loading" data-media-state={failed ? "error" : "loading"} role="status">
              <p>{failed ? errorText : loadingText}</p>
              {failed ? <button className="button button-secondary" onClick={() => { setRemoteImage(null); setRetry(value => value + 1); }}>{retryText}</button> : null}
            </div>
          )}
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
        {index + 1} / {totalImages}
        {zoomHint ? <span className="inside-lightbox-zoom-hint">{zoomHint}</span> : null}
      </p>
    </div>,
    document.body
  );
}
