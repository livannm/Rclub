import { InMemorySiteAssetRepository } from "@/lib/site-assets/in-memory-site-asset-repository";
import { SiteAssetService } from "@/lib/site-assets/site-asset-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const siteAssetService = getOrCreateGlobalSingleton(
  "__rclubSiteAssetService",
  () => new SiteAssetService(new InMemorySiteAssetRepository())
);
