import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { PrismaGalleryRepository } from "@/lib/gallery/prisma-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";
import { getPrismaClient } from "@/lib/prisma/client";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const galleryService = getOrCreateGlobalSingleton("__rclubGalleryService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaGalleryRepository(getPrismaClient())
    : new InMemoryGalleryRepository();

  return new GalleryService(repository);
});
