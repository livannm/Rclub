import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("next-intl/server", () => ({ getLocale: vi.fn(async () => "en") }));
vi.mock("@/lib/events/events-service-instance", () => ({ eventService: { findBySlug: vi.fn() } }));
vi.mock("@/lib/gallery/gallery-service-instance", () => ({ galleryService: { listEventPhotosPage: vi.fn() } }));
import { GET } from "@/app/api/gallery/[slug]/route";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { DEMO_EVENTS, DEMO_GALLERY_PHOTOS } from "@/lib/seed/demo-content";

beforeEach(() => vi.clearAllMocks());
describe("public paginated gallery endpoint", () => {
  it.each([null, { ...DEMO_EVENTS[0], is_published: false }])("rejects missing or unpublished events", async event => {
    vi.mocked(eventService.findBySlug).mockResolvedValue(event);
    const response = await GET(new Request("https://example.test/api/gallery/album?page=2"), { params: Promise.resolve({ slug: "album" }) });
    expect(response.status).toBe(404);
    expect(galleryService.listEventPhotosPage).not.toHaveBeenCalled();
  });
  it("returns one localized page and a total without caching private language choices", async () => {
    vi.mocked(eventService.findBySlug).mockResolvedValue(DEMO_EVENTS[0]);
    vi.mocked(galleryService.listEventPhotosPage).mockResolvedValue({
      items: [{ ...DEMO_GALLERY_PHOTOS[0], alt_en: "English caption" }], page: 2, total: 25, pageSize: 24, offset: 24, totalPages: 2,
    });
    const response = await GET(new Request("https://example.test/api/gallery/album?page=2"), { params: Promise.resolve({ slug: "album" }) });
    expect(galleryService.listEventPhotosPage).toHaveBeenCalledWith("album", 2);
    expect(await response.json()).toMatchObject({ page: 2, total: 25, items: [{ alt: "English caption" }] });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });
});
