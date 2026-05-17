import { describe, expect, it } from "vitest";
import { InMemorySiteAssetRepository } from "@/lib/site-assets/in-memory-site-asset-repository";
import { SiteAssetService } from "@/lib/site-assets/site-asset-service";

describe("SiteAssetService", () => {
  function makeService() {
    return new SiteAssetService(new InMemorySiteAssetRepository());
  }

  describe("getHeroVideo()", () => {
    it("returns the default URL when no asset is set", async () => {
      const service = makeService();
      const url = await service.getHeroVideo();
      expect(url).toBe("/media/hero.mp4");
    });
  });

  describe("getHeroPoster()", () => {
    it("returns the default poster URL when no asset is set", async () => {
      const service = makeService();
      const url = await service.getHeroPoster();
      expect(url).toBe("/media/hero-poster.jpg");
    });
  });

  describe("updateHeroVideo()", () => {
    it("updates the hero video URL and returns it", async () => {
      const service = makeService();
      const returned = await service.updateHeroVideo("https://cdn.example.com/new-hero.mp4");
      expect(returned).toBe("https://cdn.example.com/new-hero.mp4");
      const url = await service.getHeroVideo();
      expect(url).toBe("https://cdn.example.com/new-hero.mp4");
    });

    it("persists the updated URL across multiple calls", async () => {
      const service = makeService();
      await service.updateHeroVideo("/media/custom.mp4");
      await service.updateHeroVideo("/media/final.mp4");
      const url = await service.getHeroVideo();
      expect(url).toBe("/media/final.mp4");
    });
  });

  describe("getLogo()", () => {
    it("returns an empty string when no logo is set", async () => {
      const service = makeService();
      const url = await service.getLogo();
      expect(url).toBe("");
    });
  });

  describe("updateLogo()", () => {
    it("updates the logo URL and returns it", async () => {
      const service = makeService();
      const returned = await service.updateLogo("/media/logo.svg");
      expect(returned).toBe("/media/logo.svg");
      const url = await service.getLogo();
      expect(url).toBe("/media/logo.svg");
    });
  });
});
