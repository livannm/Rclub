import { describe, expect, it } from "vitest";
import { authenticateAdminUser } from "@/lib/auth/admin-auth";

describe("authenticateAdminUser", () => {
  it("returns an admin user when credentials are valid", () => {
    const user = authenticateAdminUser(
      { email: "admin@rclub.fr", password: "secret1234" },
      { adminEmail: "admin@rclub.fr", adminPassword: "secret1234" }
    );

    expect(user).toEqual({
      id: "admin",
      email: "admin@rclub.fr"
    });
  });

  it("returns null when password is invalid", () => {
    const user = authenticateAdminUser(
      { email: "admin@rclub.fr", password: "wrong-password" },
      { adminEmail: "admin@rclub.fr", adminPassword: "secret1234" }
    );

    expect(user).toBeNull();
  });
});
