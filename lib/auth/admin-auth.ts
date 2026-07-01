import { verifyAdminCredentials } from "@/lib/auth/credentials";
import type { AuthenticatedAdminUser } from "@/lib/auth/admin-auth-types";
import { adminUserService } from "@/lib/admin-users/admin-user-service-instance";

type AdminAuthInput = {
  email?: string;
  password?: string;
};

export type { AuthenticatedAdminUser };

export async function authenticateAdminUser(
  input: AdminAuthInput,
): Promise<AuthenticatedAdminUser | null> {
  const email = input.email?.trim();
  const password = input.password;
  if (!email || !password) {
    return null;
  }

  const dbUser = await adminUserService.verifyCredentials(email, password);
  if (dbUser) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
  }

  const envResult = verifyAdminCredentials(
    { email, password },
    {
      adminEmail: process.env.ADMIN_EMAIL,
      adminPassword: process.env.ADMIN_PASSWORD,
    },
  );

  if (envResult.ok && process.env.ADMIN_EMAIL) {
    return {
      id: "env-admin",
      email: process.env.ADMIN_EMAIL,
      role: "super_admin",
    };
  }

  return null;
}
