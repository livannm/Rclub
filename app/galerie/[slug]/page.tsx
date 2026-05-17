import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";
import { getLocalizedEventContent } from "@/lib/events/event-localized";

type Props = { params: Promise<{ slug: string }> };

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
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <Link href="/galerie" style={{ fontSize: "0.9rem" }}>{t("backToGallery")}</Link>
      <h1>{title}</h1>

      {localizedPhotos.length === 0 ? (
        <p data-testid="gallery-empty">{t("empty")}</p>
      ) : null}

      <section
        aria-label={t("sectionLabel")}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}
      >
        {localizedPhotos.map((photo, index) => (
          <figure key={photo.id} style={{ border: "1px solid #333", padding: "0.5rem", margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-testid={`gallery-photo-${index}`}
              src={photo.image_url}
              alt={photo.alt}
              loading="lazy"
              style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            />
            <figcaption style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{photo.alt}</figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
