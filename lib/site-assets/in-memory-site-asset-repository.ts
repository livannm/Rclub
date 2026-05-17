import type { SiteAssetKey } from "@/lib/site-assets/site-asset-types";
import { DEFAULT_LOGO_URL } from "@/lib/site-assets/site-asset-types";
import type { SiteAssetRepository } from "@/lib/site-assets/site-asset-repository";

const DEFAULTS: Partial<Record<SiteAssetKey, string>> = {
  logo: DEFAULT_LOGO_URL,
  home_hero_video: "/media/hero.mp4",
  home_hero_poster: "/media/hero-poster.jpg"
};

export class InMemorySiteAssetRepository implements SiteAssetRepository {
  private store: Map<SiteAssetKey, string>;

  constructor() {
    this.store = new Map(
      Object.entries(DEFAULTS) as Array<[SiteAssetKey, string]>
    );
  }

  async get(key: SiteAssetKey): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async set(key: SiteAssetKey, value: string): Promise<void> {
    this.store.set(key, value);
  }
}
