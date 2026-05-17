import { describe, expect, it } from "vitest";
import type { ClubEvent } from "@/lib/events/event-schema";
import {
  absoluteUrl,
  buildEventGalleryMetadata,
  buildEventJsonLd,
  buildOrganizationJsonLd,
  buildPageMetadata,
  seoPages
} from "@/lib/seo/metadata";

const event: ClubEvent = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "cash-out",
  title_fr: "Cash Out",
  title_en: "Cash Out EN",
  description_fr: "Soiree premium a Strasbourg",
  description_en: "Premium party in Strasbourg",
  starts_at: "2099-08-01T22:00:00.000Z",
  ends_at: "2099-08-02T04:00:00.000Z",
  location: "Rclub Strasbourg",
  cover_image_url: "https://example.com/cash-out.jpg",
  hero_video_url: "https://example.com/cash-out.mp4",
  ticket_url: "https://tickets.example.com/cash-out",
  is_published: true,
  created_at: "2026-05-17T00:00:00.000Z",
  updated_at: "2026-05-17T00:00:00.000Z"
};

describe("SEO metadata", () => {
  it("builds canonical Open Graph metadata for each public static page", () => {
    for (const key of Object.keys(seoPages) as Array<keyof typeof seoPages>) {
      const metadata = buildPageMetadata(key, "https://club.example");
      const page = seoPages[key];

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.alternates?.canonical).toBe(absoluteUrl(page.path, "https://club.example"));
      expect(metadata.openGraph?.url).toBe(absoluteUrl(page.path, "https://club.example"));
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    }
  });

  it("builds localized gallery metadata with cover image previews", () => {
    const metadata = buildEventGalleryMetadata(event, "en", "https://club.example/");

    expect(metadata.title).toBe("Cash Out EN - Galerie photos Rclub Strasbourg");
    expect(metadata.description).toBe("Premium party in Strasbourg");
    expect(metadata.alternates?.canonical).toBe("https://club.example/galerie/cash-out");
    expect(metadata.openGraph?.locale).toBe("en_US");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://example.com/cash-out.jpg",
        alt: "Cash Out EN"
      }
    ]);
  });

  it("builds structured data for the club and upcoming events", () => {
    expect(buildOrganizationJsonLd("https://club.example", "/media/logo.svg")).toMatchObject({
      "@type": "NightClub",
      name: "Rclub Strasbourg",
      url: "https://club.example",
      logo: "https://club.example/media/logo.svg"
    });

    expect(buildEventJsonLd(event, "fr", "https://club.example")).toMatchObject({
      "@type": "Event",
      name: "Cash Out",
      startDate: "2099-08-01T22:00:00.000Z",
      image: ["https://example.com/cash-out.jpg"],
      url: "https://club.example/agenda#cash-out",
      offers: {
        "@type": "Offer",
        url: "https://tickets.example.com/cash-out"
      }
    });
  });
});
