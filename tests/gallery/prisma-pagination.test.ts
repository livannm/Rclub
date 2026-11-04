import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { PrismaGalleryRepository } from "@/lib/gallery/prisma-gallery-repository";
import { PrismaEventRepository } from "@/lib/events/prisma-event-repository";

function database() {
  const model = () => ({ count: vi.fn(async () => 49), findMany: vi.fn(async () => []) });
  return { event: model(), eventMedia: model() };
}

describe("database-side pagination", () => {
  it("limits the photo query and uses a deterministic manual order", async () => {
    const db = database();
    const repo = new PrismaGalleryRepository(db as unknown as PrismaClient);
    const result = await repo.listByEventSlugPage("album", 2, 24);
    expect(result).toMatchObject({ page: 2, total: 49, offset: 24 });
    expect(db.eventMedia.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 24, take: 24, orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }));
  });
  it("only queries published albums with photos, newest event first", async () => {
    const db = database();
    const repo = new PrismaGalleryRepository(db as unknown as PrismaClient);
    await repo.listAlbums(2, 5);
    expect(db.event.findMany).toHaveBeenCalledWith({
      where: { isPublished: true, medias: { some: { type: "photo" } } },
      orderBy: [{ startsAt: "desc" }, { id: "asc" }], skip: 5, take: 5,
    });
  });
  it("applies agenda date filters to both the count and the paginated query", async () => {
    const db = database();
    const repo = new PrismaEventRepository(db as unknown as PrismaClient);
    await repo.listPublishedPage({ page: 2, pageSize: 5, descending: true, startsAtFrom: "2026-06-01T10:00:00Z", startsAtTo: "2026-07-01T10:00:00Z" });
    const where = { isPublished: true, startsAt: { gte: new Date("2026-06-01T10:00:00Z"), lt: new Date("2026-07-01T10:00:00Z") } };
    expect(db.event.count).toHaveBeenCalledWith({ where });
    expect(db.event.findMany).toHaveBeenCalledWith({ where, orderBy: [{ startsAt: "desc" }, { id: "asc" }], skip: 5, take: 5 });
  });
});
