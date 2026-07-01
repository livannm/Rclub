"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminUserServiceError,
  type AdminUserService,
} from "@/lib/admin-users/admin-user-service";
import { adminUserService } from "@/lib/admin-users/admin-user-service-instance";
import type { AdminRole } from "@/lib/admin-users/admin-user-types";
import { requireSuperAdminSession } from "@/lib/auth/session";

function redirectWithMessage(message: string): never {
  redirect(`/admin/users?message=${encodeURIComponent(message)}`);
}

export async function createAdminUserAction(formData: FormData) {
  await requireSuperAdminSession();

  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  if (typeof email !== "string" || typeof password !== "string" || typeof role !== "string") {
    redirectWithMessage("Tous les champs sont requis.");
  }

  try {
    await adminUserService.createUser({
      email,
      password,
      role: role as AdminRole,
    });
  } catch (error) {
    if (error instanceof AdminUserServiceError) {
      redirectWithMessage(error.message);
    }
    throw error;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?created=1");
}

export type AdminUserActionsService = AdminUserService;
