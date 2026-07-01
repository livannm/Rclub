import type { MetadataRoute } from "next";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { absoluteUrl, getSiteUrl, seoPages } from "@/lib/seo/metadata";

async function getDynamicEntries(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const gallerySlugs = await galleryService.listEventSlugs();
    const galleryEvents = await Promise.all(
      gallerySlugs.map((slug) => eventService.findBySlug(slug))
    );

    const publishedGalleryEvents = galleryEvents.filter(
      (event): event is NonNullable<typeof event> => Boolean(event?.is_published)
    );

    const upcomingEvents = await eventService.listPublishedUpcoming();

    const galleryEntries: MetadataRoute.Sitemap = publishedGalleryEvents.map((event) => ({
      url: absoluteUrl(`/galerie/${event.slug}`, siteUrl),
      lastModified: new Date(event.updated_at),
      changeFrequency: "monthly",
      priority: 0.7
    }));

    const eventEntries: MetadataRoute.Sitemap = upcomingEvents.map((event) => ({
      url: absoluteUrl(`/agenda/${event.slug}`, siteUrl),
      lastModified: new Date(event.updated_at),
      changeFrequency: "weekly",
      priority: 0.85
    }));

    return [...eventEntries, ...galleryEntries];
  } catch (error) {
    // Never fail the build/export because event data is unavailable (e.g. the
    // database is not reachable at build time). Fall back to static pages only.
    console.error("[sitemap] impossible de charger les événements:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = Object.values(seoPages).map((page) => ({
    url: absoluteUrl(page.path, siteUrl),
    lastModified: now,
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.8
  }));

  const dynamicEntries = await getDynamicEntries(siteUrl);

  return [...staticEntries, ...dynamicEntries];
}
