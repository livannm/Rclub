import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const galleryService = getOrCreateGlobalSingleton(
  "__rclubGalleryService",
  () => new GalleryService(new InMemoryGalleryRepository())
);
