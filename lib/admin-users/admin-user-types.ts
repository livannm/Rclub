export type AdminRole = "super_admin" | "editor";

export type AdminUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserPublic = Omit<AdminUserRecord, "passwordHash">;

export type CreateAdminUserInput = {
  email: string;
  password: string;
  role: AdminRole;
};
