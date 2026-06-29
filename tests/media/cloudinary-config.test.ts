import { describe, expect, it } from "vitest";
import { getCloudinaryConfig, isCloudStorageEnabled } from "@/lib/media/cloudinary-config";

describe("getCloudinaryConfig", () => {
  it("returns null when credentials are missing", () => {
    expect(getCloudinaryConfig({})).toBeNull();
    expect(isCloudStorageEnabled({})).toBe(false);
  });

  it("returns null when only some credentials are present", () => {
    expect(
      getCloudinaryConfig({ CLOUDINARY_CLOUD_NAME: "demo", CLOUDINARY_API_KEY: "123" })
    ).toBeNull();
  });

  it("treats the .env.example placeholders as not configured", () => {
    expect(
      getCloudinaryConfig({
        CLOUDINARY_CLOUD_NAME: "your_cloud_name",
        CLOUDINARY_API_KEY: "your_api_key",
        CLOUDINARY_API_SECRET: "your_api_secret"
      })
    ).toBeNull();
  });

  it("returns a config and defaults the folder when fully configured", () => {
    const config = getCloudinaryConfig({
      CLOUDINARY_CLOUD_NAME: "demo",
      CLOUDINARY_API_KEY: "key",
      CLOUDINARY_API_SECRET: "secret"
    });

    expect(config).toEqual({
      cloudName: "demo",
      apiKey: "key",
      apiSecret: "secret",
      folder: "rclub"
    });
    expect(
      isCloudStorageEnabled({
        CLOUDINARY_CLOUD_NAME: "demo",
        CLOUDINARY_API_KEY: "key",
        CLOUDINARY_API_SECRET: "secret"
      })
    ).toBe(true);
  });

  it("respects a custom folder", () => {
    const config = getCloudinaryConfig({
      CLOUDINARY_CLOUD_NAME: "demo",
      CLOUDINARY_API_KEY: "key",
      CLOUDINARY_API_SECRET: "secret",
      CLOUDINARY_FOLDER: "events"
    });

    expect(config?.folder).toBe("events");
  });
});
