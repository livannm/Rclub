import { verifyAdminCredentials } from "@/lib/auth/credentials";

type AdminAuthInput = {
  email?: string;
  password?: string;
};

type AdminAuthEnv = {
  adminEmail?: string;
  adminPassword?: string;
};

export function authenticateAdminUser(input: AdminAuthInput, env: AdminAuthEnv) {
  const result = verifyAdminCredentials(input, env);

  if (!result.ok) {
    return null;
  }

  return {
    id: "admin",
    email: env.adminEmail
  };
}
