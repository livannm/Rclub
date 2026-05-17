import { describe, expect, it } from "vitest";
import { getAdminRedirectPath } from "@/lib/auth/guard";

describe("getAdminRedirectPath", () => {
  it("returns null for authenticated admin access", () => {
    expect(getAdminRedirectPath("/admin", true)).toBeNull();
  });

  it("redirects unauthenticated users to admin login with callback", () => {
    expect(getAdminRedirectPath("/admin", false)).toBe("/admin/login?callbackUrl=%2Fadmin");
  });

  it("does not redirect public routes", () => {
    expect(getAdminRedirectPath("/", false)).toBeNull();
  });
});
