import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().min(2),
  password: z.string().min(8)
});

type VerifyEnv = {
  adminEmail?: string;
  adminPassword?: string;
};

type VerifyInput = {
  email?: string;
  password?: string;
};

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "MISSING_ENV" | "INVALID_PAYLOAD" | "INVALID_CREDENTIALS" };

export function verifyAdminCredentials(input: VerifyInput, env: VerifyEnv): VerifyResult {
  if (!env.adminEmail || !env.adminPassword) {
    return { ok: false, reason: "MISSING_ENV" };
  }

  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "INVALID_PAYLOAD" };
  }

  const credentialsAreValid =
    parsed.data.email === env.adminEmail && parsed.data.password === env.adminPassword;

  if (!credentialsAreValid) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  return { ok: true };
}
