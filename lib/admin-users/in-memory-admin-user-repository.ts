import type { AdminUserRecord } from "@/lib/admin-users/admin-user-types";
import type { AdminUserRepository } from "@/lib/admin-users/admin-user-repository";

function makeId() {
  return crypto.randomUUID();
}

export class InMemoryAdminUserRepository implements AdminUserRepository {
  private users = new Map<string, AdminUserRecord>();

  async list(): Promise<AdminUserRecord[]> {
    return [...this.users.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  async findByEmail(email: string): Promise<AdminUserRecord | null> {
    return this.users.get(email) ?? null;
  }

  async create(input: {
    email: string;
    passwordHash: string;
    role: AdminUserRecord["role"];
  }): Promise<AdminUserRecord> {
    if (this.users.has(input.email)) {
      throw new Error("Un compte admin existe déjà avec cet identifiant.");
    }

    const now = new Date().toISOString();
    const record: AdminUserRecord = {
      id: makeId(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(input.email, record);
    return record;
  }

  async count(): Promise<number> {
    return this.users.size;
  }

  async upsertBootstrap(input: {
    email: string;
    passwordHash: string;
    role: AdminUserRecord["role"];
  }): Promise<void> {
    const existing = this.users.get(input.email);
    const now = new Date().toISOString();
    this.users.set(input.email, {
      id: existing?.id ?? makeId(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }
}
