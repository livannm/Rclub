import type { PrismaClient } from "@prisma/client";
import type { SiteAssetKey } from "@/lib/site-assets/site-asset-types";
import type { SiteAssetRepository } from "@/lib/site-assets/site-asset-repository";

export class PrismaSiteAssetRepository implements SiteAssetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async get(key: SiteAssetKey): Promise<string | null> {
    const asset = await this.prisma.siteAsset.findFirst({
      where: { key }
    });
    return asset?.value ?? null;
  }

  async set(key: SiteAssetKey, value: string): Promise<void> {
    await this.prisma.siteAsset.upsert({
      where: { key_locale: { key, locale: "global" } },
      create: { key, value, locale: "global" },
      update: { value }
    });
  }
}
