import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/auth", () => ({
  auth: vi.fn()
}));

vi.mock("@/lib/site-assets/site-asset-service-instance", () => ({
  siteAssetService: {
    getLogo: vi.fn().mockResolvedValue("/media/logo.svg"),
    updateLogo: vi.fn().mockImplementation(async (url: string) => url)
  }
}));

import { auth } from "@/auth";
import { PUT } from "@/app/api/admin/site-assets/logo/route";

const mockAuth = vi.mocked(auth);

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/admin/site-assets/logo", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("PUT /api/admin/site-assets/logo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const res = await PUT(makeRequest({ url: "https://example.com/logo.png" }));
    expect(res.status).toBe(401);
  });

  it("returns 200 with updated logo URL when session is valid", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin", email: "admin@rclub.fr" },
      expires: "2099-01-01"
    } as never);

    const res = await PUT(makeRequest({ url: "https://example.com/logo.png" }));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://example.com/logo.png");
  });

  it("returns 400 when url field is missing", async () => {
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

    const req = new NextRequest("http://localhost/api/admin/site-assets/logo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "not-json"
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});
