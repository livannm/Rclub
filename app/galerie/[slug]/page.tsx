import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { buildEventGalleryMetadata, buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const event = await eventService.findBySlug(slug);

  if (!event || !event.is_published) {
    return buildPageMetadata("gallery");
  }

  return buildEventGalleryMetadata(event, locale);
}

export default async function GalerieEventPage({ params }: Props) {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Gallery");

  const [photos, event] = await Promise.all([
    galleryService.listEventPhotos(slug),
    eventService.findBySlug(slug)
  ]);

  if (photos.length === 0 && !event) {
    notFound();
  }

  const localizedPhotos = localizeGalleryPhotos(photos, locale);
  const localized = event ? getLocalizedEventContent(event, locale) : null;
  const title = localized?.title ?? slug;

  return (
    <main className="page-shell site-grid">
      <Link href="/galerie" className="back-link">{t("backToGallery")}</Link>
      <h1>{title}</h1>

      {localizedPhotos.length === 0 ? (
        <p data-testid="gallery-empty">{t("empty")}</p>
      ) : null}

      <section
        aria-label={t("sectionLabel")}
        className="gallery-grid"
      >
        {localizedPhotos.map((photo, index) => (
          <figure key={photo.id} className="media-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-testid={`gallery-photo-${index}`}
              src={photo.image_url}
              alt={photo.alt}
              loading="lazy"
              className="gallery-photo"
            />
            <figcaption className="media-card-body">{photo.alt}</figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
