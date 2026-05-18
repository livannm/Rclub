import type { SiteAssetRepository } from "@/lib/site-assets/site-asset-repository";
import { DEFAULT_LOGO_URL } from "@/lib/site-assets/site-asset-types";

const DEFAULTS = {
  home_hero_video: "/media/hero.mp4",
  home_hero_poster: "/media/hero-poster.png",
  logo: DEFAULT_LOGO_URL
} as const;

export class SiteAssetService {
  constructor(private readonly repository: SiteAssetRepository) {}

  async getHeroVideo(): Promise<string> {
    const value = await this.repository.get("home_hero_video");
    return value ?? DEFAULTS.home_hero_video;
  }

  async getHeroPoster(): Promise<string> {
    const value = await this.repository.get("home_hero_poster");
    return value ?? DEFAULTS.home_hero_poster;
  }

  async updateHeroVideo(url: string): Promise<string> {
    await this.repository.set("home_hero_video", url);
    return url;
  }

  async getLogo(): Promise<string> {
    const value = await this.repository.get("logo");
    return value ?? DEFAULTS.logo;
  }

  async updateLogo(url: string): Promise<string> {
    await this.repository.set("logo", url);
    return url;
  }
}
