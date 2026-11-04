import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locales";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";
import { parsePage } from "@/lib/utils/pagination";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await eventService.findBySlug(slug);
  if (!event?.is_published) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const page = parsePage(new URL(request.url).searchParams.get("page"));
  const result = await galleryService.listEventPhotosPage(slug, page);
  const locale = resolveLocale(await getLocale());
  return NextResponse.json({
    ...result,
    items: localizeGalleryPhotos(result.items, locale).map(photo => ({ id: photo.id, src: photo.image_url, alt: photo.alt })),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
