import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/media/upload-validation";

describe("validateUpload", () => {
  it("accepts a valid image and reports its resource type", () => {
    const result = validateUpload({ contentType: "image/png", size: 1024 });
    expect(result).toEqual({ ok: true, resourceType: "image" });
  });

  it("accepts a valid video and reports its resource type", () => {
    const result = validateUpload({ contentType: "video/mp4", size: 2048 });
    expect(result).toEqual({ ok: true, resourceType: "video" });
  });

  it("is case-insensitive on the content type", () => {
    expect(validateUpload({ contentType: "IMAGE/JPEG", size: 10 }).ok).toBe(true);
  });

  it("rejects unsupported content types", () => {
    const result = validateUpload({ contentType: "application/pdf", size: 10 });
    expect(result.ok).toBe(false);
  });

  it("rejects empty files", () => {
    const result = validateUpload({ contentType: "image/png", size: 0 });
    expect(result.ok).toBe(false);
  });

  it("rejects files larger than the max size", () => {
    const result = validateUpload({ contentType: "image/png", size: MAX_UPLOAD_BYTES + 1 });
    expect(result.ok).toBe(false);
  });
});
