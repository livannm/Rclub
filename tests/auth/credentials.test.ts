import { describe, expect, it } from "vitest";
import { verifyAdminCredentials } from "@/lib/auth/credentials";

describe("verifyAdminCredentials", () => {
  it("accepts valid credentials", () => {
    const result = verifyAdminCredentials(
      { email: "admin@rclub.fr", password: "secret1234" },
      { adminEmail: "admin@rclub.fr", adminPassword: "secret1234" }
    );

    expect(result).toEqual({ ok: true });
  });

  it("rejects unknown admin email", () => {
    const result = verifyAdminCredentials(
      { email: "wrong@rclub.fr", password: "secret1234" },
      { adminEmail: "admin@rclub.fr", adminPassword: "secret1234" }
    );

    expect(result).toEqual({
      ok: false,
      reason: "INVALID_CREDENTIALS"
    });
  });

  it("rejects malformed payload", () => {
    const result = verifyAdminCredentials(
      { email: "bad-email", password: "123" },
      { adminEmail: "admin@rclub.fr", adminPassword: "secret1234" }
    );

    expect(result).toEqual({
      ok: false,
      reason: "INVALID_PAYLOAD"
    });
  });
});
