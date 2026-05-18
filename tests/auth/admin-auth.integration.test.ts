import { describe, expect, it } from "vitest";
import { authenticateAdminUser } from "@/lib/auth/admin-auth";

describe("authenticateAdminUser", () => {
  it("returns an admin user when credentials are valid", () => {
    const user = authenticateAdminUser(
      { email: "adminRclub", password: "strasbourgRClub" },
      { adminEmail: "adminRclub", adminPassword: "strasbourgRClub" }
    );

    expect(user).toEqual({
      id: "admin",
      email: "adminRclub"
    });
  });

  it("returns null when password is invalid", () => {
    const user = authenticateAdminUser(
      { email: "adminRclub", password: "wrong-password" },
      { adminEmail: "adminRclub", adminPassword: "strasbourgRClub" }
    );

    expect(user).toBeNull();
  });
});
