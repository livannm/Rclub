import type { AppLocale } from "@/i18n/locales";
import type { GalleryPhoto, LocalizedGalleryPhoto } from "@/lib/gallery/gallery-types";

export function localizeGalleryPhotos(
  photos: GalleryPhoto[],
  locale: AppLocale
): LocalizedGalleryPhoto[] {
  return photos.map((photo) => ({
    id: photo.id,
    image_url: photo.image_url,
    alt: locale === "en" ? photo.alt_en : photo.alt_fr,
    order: photo.order
  }));
}
