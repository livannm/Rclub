import { createAdminUserAction } from "@/lib/admin/admin-user-actions";
import { adminUserService } from "@/lib/admin-users/admin-user-service-instance";
import { requireSuperAdminSession } from "@/lib/auth/session";

type AdminUsersPageProps = {
  searchParams: Promise<{ created?: string; message?: string }>;
};

const ROLE_LABELS = {
  super_admin: "Super admin",
  editor: "Éditeur",
} as const;

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireSuperAdminSession();
  const params = await searchParams;
  const users = await adminUserService.listUsers();

  return (
    <main className="admin-shell">
      <div className="admin-page-bar">
        <div>
          <h1 className="admin-page-title">Comptes admin</h1>
          <p className="admin-page-subtitle">
            Créez des accès pour votre équipe. Seuls les super admins peuvent gérer les comptes.
          </p>
        </div>
      </div>

      {params.created === "1" ? (
        <p className="status status-success">Compte admin créé.</p>
      ) : null}
      {params.message ? <p className="status status-error">{params.message}</p> : null}

      <section aria-labelledby="admin-users-list-heading" className="admin-section">
        <h2 id="admin-users-list-heading" className="admin-section-title">
          Comptes existants
        </h2>
        <div className="admin-card">
          {users.length === 0 ? (
            <p className="admin-empty">Aucun compte enregistré pour le moment.</p>
          ) : (
            <ul className="admin-user-list">
              {users.map((user) => (
                <li key={user.id} className="admin-user-list-item">
                  <div>
                    <strong>{user.email}</strong>
                    <p className="admin-user-meta">
                      {ROLE_LABELS[user.role]} · créé le{" "}
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="admin-users-create-heading" className="admin-section">
        <h2 id="admin-users-create-heading" className="admin-section-title">
          Nouveau compte
        </h2>
        <form action={createAdminUserAction} className="admin-card admin-form form-grid">
          <label htmlFor="email">
            Identifiant
            <input id="email" name="email" type="text" autoComplete="username" required />
          </label>

          <label htmlFor="password">
            Mot de passe
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label htmlFor="role">
            Rôle
            <select id="role" name="role" defaultValue="editor" required>
              <option value="editor">Éditeur — accès admin complet</option>
              <option value="super_admin">Super admin — peut créer des comptes</option>
            </select>
          </label>

          <button type="submit">Créer le compte</button>
        </form>
      </section>
    </main>
  );
}
