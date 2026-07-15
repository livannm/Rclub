import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("gallery");
}

export default async function GaleriePage() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("GalleryIndex");

  const slugs = await galleryService.listEventSlugs();
  const events = await Promise.all(slugs.map((slug) => eventService.findBySlug(slug)));

  return (
    <main className="page-shell site-grid">
      <p className="page-kicker">{t("kicker")}</p>
      <h1 className="page-title">{t("title")}</h1>

      {slugs.length === 0 ? (
        <p className="agenda-empty" data-testid="gallery-index-empty">{t("empty")}</p>
      ) : null}

      <section
        aria-label={t("sectionLabel")}
        className="card-grid"
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
              className="media-card media-link"
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt={title}
                  loading="lazy"
                  className="media-card-image"
                />
              ) : null}
              <h2 className="media-card-body">{title}</h2>
            </a>
          );
        })}
      </section>
    </main>
  );
}
