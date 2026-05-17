import { InMemoryHomepageContentRepository } from "@/lib/homepage/in-memory-homepage-content-repository";
import { HomepageContentService } from "@/lib/homepage/homepage-content-service";

const globalHomepageContentService = globalThis as typeof globalThis & {
  __rclubHomepageContentService?: HomepageContentService;
};

if (!globalHomepageContentService.__rclubHomepageContentService) {
  globalHomepageContentService.__rclubHomepageContentService = new HomepageContentService(
    new InMemoryHomepageContentRepository()
  );
}

export const homepageContentService = globalHomepageContentService.__rclubHomepageContentService;
