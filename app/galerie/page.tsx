import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";

export default async function GaleriePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("GalleryIndex");

  const slugs = await galleryService.listEventSlugs();
  const events = await Promise.all(slugs.map((slug) => eventService.findBySlug(slug)));

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <h1>{t("title")}</h1>

      {slugs.length === 0 ? <p data-testid="gallery-index-empty">{t("empty")}</p> : null}

      <section
        aria-label={t("sectionLabel")}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem"
        }}
      >
        {slugs.map((slug, index) => {
          const event = events[index];
          const localized = event ? getLocalizedEventContent(event, locale) : null;
          const title = localized?.title ?? slug;
          const coverUrl = event?.cover_image_url ?? null;

          return (
            <a
              key={slug}
              href={`/galerie/${slug}`}
              data-testid={`gallery-index-item-${index}`}
              style={{ border: "1px solid #333", padding: "0.5rem", display: "grid", gap: "0.5rem", textDecoration: "none", color: "inherit" }}
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt={title}
                  loading="lazy"
                  style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                />
              ) : null}
              <h2 style={{ margin: 0, fontSize: "1rem" }}>{title}</h2>
            </a>
          );
        })}
      </section>
    </main>
  );
}
