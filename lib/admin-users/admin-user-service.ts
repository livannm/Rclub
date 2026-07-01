import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { AdminUserRepository } from "@/lib/admin-users/admin-user-repository";
import type {
  AdminUserPublic,
  AdminUserRecord,
  CreateAdminUserInput,
} from "@/lib/admin-users/admin-user-types";

const createAdminUserSchema = z.object({
  email: z.string().trim().min(2),
  password: z.string().min(8),
  role: z.enum(["super_admin", "editor"]),
});

export class AdminUserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminUserServiceError";
  }
}

function toPublic(user: AdminUserRecord): AdminUserPublic {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export class AdminUserService {
  constructor(private readonly repository: AdminUserRepository) {}

  async listUsers(): Promise<AdminUserPublic[]> {
    await this.ensureBootstrapFromEnv();
    const users = await this.repository.list();
    return users.map(toPublic);
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<AdminUserPublic | null> {
    await this.ensureBootstrapFromEnv();
    const user = await this.repository.findByEmail(email.trim());
    if (!user?.passwordHash) {
      return null;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    return valid ? toPublic(user) : null;
  }

  async createUser(input: CreateAdminUserInput): Promise<AdminUserPublic> {
    const parsed = createAdminUserSchema.safeParse(input);
    if (!parsed.success) {
      throw new AdminUserServiceError(
        parsed.error.issues[0]?.message ?? "Données invalides.",
      );
    }

    const email = parsed.data.email.trim();
    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new AdminUserServiceError("Un compte admin existe déjà avec cet identifiant.");
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const created = await this.repository.create({
      email,
      passwordHash,
      role: parsed.data.role,
    });
    return toPublic(created);
  }

  private async ensureBootstrapFromEnv(): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD?.trim();
    if (!email || !password) {
      return;
    }

    const count = await this.repository.count();
    const existing = await this.repository.findByEmail(email);
    if (count > 0 && existing) {
      return;
    }

    const passwordHash = await hashPassword(password);
    await this.repository.upsertBootstrap({
      email,
      passwordHash,
      role: "super_admin",
    });
  }
}
