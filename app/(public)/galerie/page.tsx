import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { Pagination } from "@/components/Pagination";
import { MediaImage } from "@/components/media/MediaImage";
import { parsePage } from "@/lib/utils/pagination";
import Link from "next/link";

export async function generateMetadata() {
  return buildLocalizedPageMetadata("gallery");
}

export default async function GaleriePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("GalleryIndex");

  const result = await galleryService.listAlbums(parsePage((await searchParams).page));

  return (
    <main className="page-shell site-grid">
      <p className="page-kicker">{t("kicker")}</p>
      <h1 className="page-title">{t("title")}</h1>

      {result.total === 0 ? (
        <p className="agenda-empty" data-testid="gallery-index-empty">{t("empty")}</p>
      ) : null}

      <section
        aria-label={t("sectionLabel")}
        className="card-grid"
      >
        {result.items.map((event, index) => {
          const localized = getLocalizedEventContent(event, locale);
          const title = localized.title;
          const coverUrl = event.cover_image_url;

          return (
            <Link
              key={event.id}
              href={`/galerie/${event.slug}${result.page > 1 ? `?albumsPage=${result.page}` : ""}`}
              prefetch={false}
              data-testid={`gallery-index-item-${index}`}
              className="media-card media-link"
            >
              {coverUrl ? (
                <MediaImage
                  src={coverUrl}
                  alt={title}
                  loading="lazy"
                  className="media-card-image"
                />
              ) : null}
              <h2 className="media-card-body">{title}</h2>
            </Link>
          );
        })}
      </section>
      <Pagination path="/galerie" page={result.page} totalPages={result.totalPages} />
    </main>
  );
}
