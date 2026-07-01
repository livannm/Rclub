import type { AdminRole } from "@/lib/admin-users/admin-user-types";

export type AuthenticatedAdminUser = {
  id: string;
  email: string;
  role: AdminRole;
};
