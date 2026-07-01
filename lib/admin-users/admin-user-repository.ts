import type { AdminRole, AdminUserRecord } from "@/lib/admin-users/admin-user-types";

export type AdminUserRepository = {
  list(): Promise<AdminUserRecord[]>;
  findByEmail(email: string): Promise<AdminUserRecord | null>;
  create(input: {
    email: string;
    passwordHash: string;
    role: AdminRole;
  }): Promise<AdminUserRecord>;
  count(): Promise<number>;
  upsertBootstrap(input: {
    email: string;
    passwordHash: string;
    role: AdminRole;
  }): Promise<void>;
};
