import { describe, expect, it } from "vitest";
import { formatMediaUploadError } from "@/lib/media/upload-error";

describe("formatMediaUploadError", () => {
  it("explains invalid Firebase credentials clearly", () => {
    const message = formatMediaUploadError(
      new Error("error:0909006C:PEM routines:get_name:no start line")
    );

    expect(message).toContain("Identifiants Firebase invalides");
    expect(message).toContain("FIREBASE_PRIVATE_KEY");
  });

  it("explains a missing bucket", () => {
    const message = formatMediaUploadError(
      new Error("The specified bucket does not exist.")
    );

    expect(message).toContain("Bucket Firebase introuvable");
    expect(message).toContain("FIREBASE_STORAGE_BUCKET");
  });

  it("explains a permission error", () => {
    const message = formatMediaUploadError(
      new Error("403 Forbidden: caller does not have storage.objects.create access")
    );

    expect(message).toContain("Permission refusée");
  });

  it("falls back to the error message", () => {
    expect(formatMediaUploadError(new Error("boom"))).toBe("boom");
  });
});
