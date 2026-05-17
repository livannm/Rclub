import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";
import { galleryService } from "@/lib/gallery/gallery-service-instance";

export default async function CashOutGalleryPage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Gallery");
  const photos = await galleryService.listEventPhotos("cash-out");
  const localizedPhotos = localizeGalleryPhotos(photos, locale);

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      {localizedPhotos.length === 0 ? <p data-testid="gallery-empty">{t("empty")}</p> : null}

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
