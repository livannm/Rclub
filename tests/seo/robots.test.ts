import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";

describe("robots metadata route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows public pages and blocks admin plus API routes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://club.example/");

    const config = robots();

    expect(config.rules).toEqual([
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ]);
    expect(config.sitemap).toBe("https://club.example/sitemap.xml");
  });
});
