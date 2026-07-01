import { afterEach, describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password helpers", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("strasbourgRClub");
    expect(hash).toContain(":");
    await expect(verifyPassword("strasbourgRClub", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });
});

describe("AdminUserService", () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
  });

  it("creates and verifies an admin user", async () => {
    const { InMemoryAdminUserRepository } = await import(
      "@/lib/admin-users/in-memory-admin-user-repository"
    );
    const { AdminUserService } = await import("@/lib/admin-users/admin-user-service");

    const service = new AdminUserService(new InMemoryAdminUserRepository());
    const created = await service.createUser({
      email: "editor1",
      password: "password1234",
      role: "editor",
    });

    expect(created.email).toBe("editor1");
    await expect(service.verifyCredentials("editor1", "password1234")).resolves.toMatchObject({
      email: "editor1",
      role: "editor",
    });
    await expect(service.verifyCredentials("editor1", "bad-password")).resolves.toBeNull();
  });

  it("bootstraps the env admin when the store is empty", async () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";

    const { InMemoryAdminUserRepository } = await import(
      "@/lib/admin-users/in-memory-admin-user-repository"
    );
    const { AdminUserService } = await import("@/lib/admin-users/admin-user-service");

    const service = new AdminUserService(new InMemoryAdminUserRepository());
    const user = await service.verifyCredentials("adminRclub", "strasbourgRClub");

    expect(user).toMatchObject({
      email: "adminRclub",
      role: "super_admin",
    });
  });
});

describe("authenticateAdminUser", () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
  });

  it("returns an env admin user when credentials are valid", async () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";

    const { authenticateAdminUser } = await import("@/lib/auth/admin-auth");
    const user = await authenticateAdminUser({
      email: "adminRclub",
      password: "strasbourgRClub",
    });

    expect(user).toMatchObject({
      email: "adminRclub",
      role: "super_admin",
    });
    expect(user?.id).toBeTruthy();
  });

  it("returns null when password is invalid", async () => {
    process.env.ADMIN_EMAIL = "adminRclub";
    process.env.ADMIN_PASSWORD = "strasbourgRClub";

    const { authenticateAdminUser } = await import("@/lib/auth/admin-auth");
    const user = await authenticateAdminUser({
      email: "adminRclub",
      password: "wrong-password",
    });

    expect(user).toBeNull();
  });
});
