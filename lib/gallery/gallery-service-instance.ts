import { InMemoryGalleryRepository } from "@/lib/gallery/in-memory-gallery-repository";
import { GalleryService } from "@/lib/gallery/gallery-service";

const globalGalleryService = globalThis as typeof globalThis & {
  __rclubGalleryService?: GalleryService;
};

if (!globalGalleryService.__rclubGalleryService) {
  globalGalleryService.__rclubGalleryService = new GalleryService(new InMemoryGalleryRepository());
}

export const galleryService = globalGalleryService.__rclubGalleryService;
