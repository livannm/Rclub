import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/media/firebase-config", () => ({
  getFirebaseStorageConfig: vi.fn(),
}));

import { auth } from "@/auth";
import { GET } from "@/app/api/admin/media/upload-config/route";
import { getFirebaseStorageConfig } from "@/lib/media/firebase-config";

describe("GET /api/admin/media/upload-config", () => {
  beforeEach(() => {
    vi.mocked(auth).mockReset();
    vi.mocked(getFirebaseStorageConfig).mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns firebase config when cloud storage is enabled", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "admin@test", role: "super_admin" },
      expires: new Date().toISOString(),
    });
    vi.mocked(getFirebaseStorageConfig).mockReturnValue({
      apiKey: "key",
      projectId: "proj",
      storageBucket: "proj.appspot.com",
      appId: "app",
    });

    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      mode: "firebase",
      firebase: {
        apiKey: "key",
        projectId: "proj",
        storageBucket: "proj.appspot.com",
        appId: "app",
      },
    });
  });

  it("returns local mode when Firebase is not configured", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "admin@test", role: "super_admin" },
      expires: new Date().toISOString(),
    });
    vi.mocked(getFirebaseStorageConfig).mockReturnValue(null);

    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ mode: "local" });
  });
});
