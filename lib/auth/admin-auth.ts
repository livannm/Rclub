import { verifyAdminCredentials } from "@/lib/auth/credentials";

type AdminAuthInput = {
  email?: string;
  password?: string;
};

type AdminAuthEnv = {
  adminEmail?: string;
  adminPassword?: string;
};

export type AuthenticatedAdminUser = {
  id: "admin";
  email: string;
};

export function authenticateAdminUser(
  input: AdminAuthInput,
  env: AdminAuthEnv
): AuthenticatedAdminUser | null {
  const result = verifyAdminCredentials(input, env);

  if (!result.ok || !env.adminEmail) {
    return null;
  }

  return {
    id: "admin",
    email: env.adminEmail
  };
}
