import { auth } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "0.75rem" }}>
      <h1>Tableau de bord admin</h1>
      <p>Connecte en tant que: {session?.user?.email ?? "admin"}</p>
      <p>
        <a href="/admin/events">Gerer les evenements</a>
      </p>
    </main>
  );
}
