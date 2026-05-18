import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { getPrismaClient } from "@/lib/prisma/client";
import { InMemorySiteAssetRepository } from "@/lib/site-assets/in-memory-site-asset-repository";
import { PrismaSiteAssetRepository } from "@/lib/site-assets/prisma-site-asset-repository";
import { SiteAssetService } from "@/lib/site-assets/site-asset-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const siteAssetService = getOrCreateGlobalSingleton("__rclubSiteAssetService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaSiteAssetRepository(getPrismaClient())
    : new InMemorySiteAssetRepository();

  return new SiteAssetService(repository);
});
