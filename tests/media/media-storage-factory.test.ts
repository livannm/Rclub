import { describe, expect, it } from "vitest";
import { createMediaStorage } from "@/lib/media/media-storage-instance";

describe("createMediaStorage", () => {
  it("falls back to local storage when Cloudinary is not configured", () => {
    const storage = createMediaStorage(null);
    expect(storage.provider).toBe("local");
  });

  it("uses Cloudinary storage when a config is provided", () => {
    const storage = createMediaStorage({
      cloudName: "demo",
      apiKey: "key",
      apiSecret: "secret",
      folder: "rclub"
    });
    expect(storage.provider).toBe("cloudinary");
  });
});
