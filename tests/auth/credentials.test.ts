import { describe, expect, it } from "vitest";
import { verifyAdminCredentials } from "@/lib/auth/credentials";

describe("verifyAdminCredentials", () => {
  it("accepts valid credentials", () => {
    const result = verifyAdminCredentials(
      { email: "adminRclub", password: "strasbourgRClub" },
      { adminEmail: "adminRclub", adminPassword: "strasbourgRClub" }
    );

    expect(result).toEqual({ ok: true });
  });

  it("rejects unknown admin identifier", () => {
    const result = verifyAdminCredentials(
      { email: "wrong-user", password: "strasbourgRClub" },
      { adminEmail: "adminRclub", adminPassword: "strasbourgRClub" }
    );

    expect(result).toEqual({
      ok: false,
      reason: "INVALID_CREDENTIALS"
    });
  });

  it("rejects malformed payload", () => {
    const result = verifyAdminCredentials(
      { email: "a", password: "123" },
      { adminEmail: "adminRclub", adminPassword: "strasbourgRClub" }
    );

    expect(result).toEqual({
      ok: false,
      reason: "INVALID_PAYLOAD"
    });
  });
});
