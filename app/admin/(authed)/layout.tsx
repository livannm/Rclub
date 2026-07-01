import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { isSuperAdminRole } from "@/lib/auth/session";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { AdminShellNav } from "@/components/admin/admin-shell-nav";

export default async function AuthedAdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const reservations = await reservationService.listAll();
  const pendingReservations = reservations.filter((r) => r.status === "new").length;

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="admin-app">
      <AdminShellNav
        pendingReservations={pendingReservations}
        adminEmail={session.user.email ?? null}
        canManageUsers={isSuperAdminRole(session.user.role)}
        signOutAction={signOutAction}
      />
      <div className="admin-app-content">{children}</div>
    </div>
  );
}
