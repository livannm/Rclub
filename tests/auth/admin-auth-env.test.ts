import { describe, expect, it, afterEach } from "vitest";
import {
  adminAuthSetupErrorMessage,
  getAdminAuthSetupError,
} from "@/lib/auth/admin-auth-env";

describe("getAdminAuthSetupError", () => {
  const envKeys = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "AUTH_SECRET", "NEXTAUTH_SECRET"] as const;

  afterEach(() => {
    for (const key of envKeys) {
      delete process.env[key];
    }
  });

  it("returns null when admin credentials and AUTH_SECRET are set", () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";
    process.env.AUTH_SECRET = "test-secret";

    expect(getAdminAuthSetupError()).toBeNull();
  });

  it("accepts NEXTAUTH_SECRET as a fallback", () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";
    process.env.NEXTAUTH_SECRET = "test-secret";

    expect(getAdminAuthSetupError()).toBeNull();
  });

  it("reports missing admin credentials", () => {
    process.env.AUTH_SECRET = "test-secret";

    expect(getAdminAuthSetupError()).toBe("MISSING_ADMIN_CREDENTIALS");
  });

  it("reports missing auth secret", () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";

    expect(getAdminAuthSetupError()).toBe("MISSING_AUTH_SECRET");
  });
});

describe("adminAuthSetupErrorMessage", () => {
  it("returns a French message for each setup error", () => {
    expect(adminAuthSetupErrorMessage("MISSING_ADMIN_CREDENTIALS")).toMatch(/ADMIN_EMAIL/);
    expect(adminAuthSetupErrorMessage("MISSING_AUTH_SECRET")).toMatch(/AUTH_SECRET/);
  });
});
