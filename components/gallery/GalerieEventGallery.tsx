"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type Props = {
  photos: Photo[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomHint?: string;
};

export function GalerieEventGallery({
  photos,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHint,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section aria-label="Photos" className="gallery-grid gallery-grid--event">
        {photos.map((photo, index) => (
          <figure key={photo.id} className="media-card gallery-photo-card">
            <button
              type="button"
              className="gallery-photo-button"
              onClick={() => setLightboxIndex(index)}
              aria-label={photo.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid={`gallery-photo-${index}`}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="gallery-photo"
              />
            </button>
          </figure>
        ))}
      </section>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          images={photos.map((p) => ({ src: p.src, alt: p.alt }))}
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
