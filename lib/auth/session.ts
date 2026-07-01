import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AdminRole } from "@/lib/admin-users/admin-user-types";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();
  if (session.user.role !== "super_admin") {
    redirect("/admin");
  }

  return session;
}

export function isSuperAdminRole(role: AdminRole | undefined): role is "super_admin" {
  return role === "super_admin";
}
