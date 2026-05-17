export type SiteAssetKey = "logo" | "home_hero_video" | "home_hero_poster";

export type SiteAsset = {
  id: string;
  key: SiteAssetKey;
  value: string;
  locale: string;
  updatedAt: string;
};
