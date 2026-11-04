"use client";

import { MediaImage } from "@/components/media/MediaImage";

import { useCallback, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { PHOTO_PAGE_SIZE, type Paginated } from "@/lib/utils/pagination";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type Props = {
  slug: string;
  page: number;
  total: number;
  photos: Photo[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomHint?: string;
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
};

export function GalerieEventGallery({
  slug,
  page,
  total,
  photos,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHint,
  loadingLabel,
  errorLabel,
  retryLabel,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const offset = (page - 1) * PHOTO_PAGE_SIZE;
  const pages = useRef(new Map<number, Promise<Photo[]>>([[page, Promise.resolve(photos)]]));
  const loadImage = useCallback(async (index: number) => {
    const targetPage = Math.floor(index / PHOTO_PAGE_SIZE) + 1;
    let pending = pages.current.get(targetPage);
    if (!pending) {
      pending = fetch(`/api/gallery/${encodeURIComponent(slug)}?page=${targetPage}`, { cache: "no-store" })
        .then(async response => {
          if (!response.ok) throw new Error("Unable to load photos");
          const result: Paginated<Photo> = await response.json();
          if (result.page !== targetPage) throw new Error("Album changed");
          return result.items;
        }).catch(error => { pages.current.delete(targetPage); throw error; });
      pages.current.set(targetPage, pending);
    }
    const image = (await pending)[index % PHOTO_PAGE_SIZE];
    if (!image) throw new Error("Photo unavailable");
    return image;
  }, [slug]);

  return (
    <>
      <section aria-label="Photos" className="gallery-grid gallery-grid--event">
        {photos.map((photo, index) => (
          <figure key={photo.id} className="media-card gallery-photo-card">
            <button
              type="button"
              className="gallery-photo-button"
              onClick={() => setLightboxIndex(offset + index)}
              aria-label={photo.alt}
            >
                <MediaImage
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
          imageOffset={offset}
          totalImages={total}
          loadImage={loadImage}
          onClose={() => setLightboxIndex(null)}
          closeLabel={closeLabel}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          zoomHint={zoomHint}
          loadingLabel={loadingLabel}
          errorLabel={errorLabel}
          retryLabel={retryLabel}
        />
      ) : null}
    </>
  );
}
