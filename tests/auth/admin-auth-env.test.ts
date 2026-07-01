import { afterEach, describe, expect, it } from "vitest";
import {
  adminAuthSetupErrorMessage,
  getAdminAuthSetupError,
} from "@/lib/auth/admin-auth-env";

describe("getAdminAuthSetupError", () => {
  const envKeys = ["AUTH_SECRET", "NEXTAUTH_SECRET"] as const;

  afterEach(() => {
    for (const key of envKeys) {
      delete process.env[key];
    }
  });

  it("returns null when AUTH_SECRET is set", () => {
    process.env.AUTH_SECRET = "test-secret";
    expect(getAdminAuthSetupError()).toBeNull();
  });

  it("accepts NEXTAUTH_SECRET as a fallback", () => {
    process.env.NEXTAUTH_SECRET = "test-secret";
    expect(getAdminAuthSetupError()).toBeNull();
  });

  it("reports missing auth secret", () => {
    expect(getAdminAuthSetupError()).toBe("MISSING_AUTH_SECRET");
  });
});

describe("adminAuthSetupErrorMessage", () => {
  it("returns a French message for missing auth secret", () => {
    expect(adminAuthSetupErrorMessage("MISSING_AUTH_SECRET")).toMatch(/AUTH_SECRET/);
  });
});
