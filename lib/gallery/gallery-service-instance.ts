import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { PrismaGalleryRepository } from "@/lib/gallery/prisma-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";
import { getPrismaClient } from "@/lib/prisma/client";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";
import { getEventService } from "@/lib/events/events-service-instance";

export const galleryService = getOrCreateGlobalSingleton("__rclubGalleryService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaGalleryRepository(getPrismaClient())
    : new InMemoryGalleryRepository(undefined, getEventService());

  return new GalleryService(repository);
});
