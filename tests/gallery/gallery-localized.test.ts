import { describe, expect, it } from "vitest";
import { localizeGalleryPhotos } from "@/lib/gallery/gallery-localized";

describe("localizeGalleryPhotos", () => {
  const photos = [
    {
      id: "photo-1",
      event_slug: "cash-out",
      image_url: "/media/a.jpg",
      alt_fr: "Photo FR",
      alt_en: "Photo EN",
      order: 1
    }
  ];

  it("maps french alt text for fr locale", () => {
    const localized = localizeGalleryPhotos(photos, "fr");
    expect(localized[0]?.alt).toBe("Photo FR");
  });

  it("maps english alt text for en locale", () => {
    const localized = localizeGalleryPhotos(photos, "en");
    expect(localized[0]?.alt).toBe("Photo EN");
  });
});
