import { describe, expect, it, vi, beforeEach } from "vitest";
import { PUT } from "@/app/api/admin/site-assets/hero-video/route";
import { NextRequest } from "next/server";

vi.mock("@/auth", () => ({
  auth: vi.fn()
}));

vi.mock("@/lib/site-assets/site-asset-service-instance", () => ({
  siteAssetService: {
    updateHeroVideo: vi.fn().mockResolvedValue(undefined),
    getHeroVideo: vi.fn().mockResolvedValue("/media/hero.mp4")
  }
}));

import { auth } from "@/auth";

const mockAuth = vi.mocked(auth);

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/admin/site-assets/hero-video", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("PUT /api/admin/site-assets/hero-video", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const res = await PUT(makeRequest({ url: "https://example.com/video.mp4" }));
    expect(res.status).toBe(401);
  });

  it("returns 200 with valid session and URL", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin", email: "admin@rclub.fr" },
      expires: "2099-01-01"
    } as never);

    const res = await PUT(makeRequest({ url: "https://example.com/video.mp4" }));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://example.com/video.mp4");
  });

  it("returns 400 when URL is missing", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin", email: "admin@rclub.fr" },
      expires: "2099-01-01"
    } as never);

    const res = await PUT(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is not valid JSON", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin", email: "admin@rclub.fr" },
      expires: "2099-01-01"
    } as never);

    const req = new NextRequest("http://localhost/api/admin/site-assets/hero-video", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "not-json"
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});
