import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";
import { getLocalizedEventContent } from "@/lib/events/event-localized";
import { GalerieEventGallery } from "@/components/gallery/GalerieEventGallery";
import { buildEventGalleryMetadata, buildPageMetadata } from "@/lib/seo/metadata";
import { Pagination } from "@/components/Pagination";
import { parsePage, pageHref } from "@/lib/utils/pagination";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string; albumsPage?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const event = await eventService.findBySlug(slug);

  if (!event || !event.is_published) {
    return buildPageMetadata("gallery");
  }

  return buildEventGalleryMetadata(event, locale);
}

export default async function GalerieEventPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Gallery");

  const query = await searchParams;
  const albumsPage = parsePage(query.albumsPage);
  const [result, event] = await Promise.all([
    galleryService.listEventPhotosPage(slug, parsePage(query.page)),
    eventService.findBySlug(slug)
  ]);

  if (!event || !event.is_published) {
    notFound();
  }

  const localizedPhotos = localizeGalleryPhotos(result.items, locale);
  const localized = event ? getLocalizedEventContent(event, locale) : null;
  const title = localized?.title ?? slug;

  return (
    <main className="page-shell site-grid">
      <Link href={pageHref("/galerie", {}, albumsPage)} className="back-link">{t("backToGallery")}</Link>
      <p className="page-kicker">{t("kicker")}</p>
      <h1 className="page-title">{title}</h1>

      {localizedPhotos.length === 0 ? (
        <p data-testid="gallery-empty">{t("empty")}</p>
      ) : (
        <GalerieEventGallery
          key={`${slug}-${result.page}-${locale}`}
          slug={slug}
          page={result.page}
          total={result.total}
          photos={localizedPhotos.map((photo) => ({
            id: photo.id,
            src: photo.image_url,
            alt: photo.alt,
          }))}
          closeLabel={t("lightboxClose")}
          prevLabel={t("lightboxPrev")}
          nextLabel={t("lightboxNext")}
          zoomHint={t("lightboxZoomHint")}
          loadingLabel={t("loading")}
          errorLabel={t("loadError")}
          retryLabel={t("retry")}
        />
      )}
      <Pagination path={`/galerie/${slug}`} query={albumsPage > 1 ? { albumsPage: String(albumsPage) } : {}} page={result.page} totalPages={result.totalPages} />
    </main>
  );
}
