import type { SiteAssetKey } from "@/lib/site-assets/site-asset-types";

export interface SiteAssetRepository {
  get(key: SiteAssetKey): Promise<string | null>;
  set(key: SiteAssetKey, value: string): Promise<void>;
}
