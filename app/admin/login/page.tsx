import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";
  const showError = params.error === "CredentialsSignin";

  async function loginAction(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(`/admin/login?error=${error.type}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }

      throw error;
    }

    redirect(callbackUrl);
  }

  return (
    <main className="page-shell page-shell-narrow">
      <p className="page-kicker">Admin</p>
      <h1>Connexion admin</h1>
      <p className="page-lead">Utilise les identifiants admin configures en environnement.</p>
      {showError ? <p className="status status-error">Identifiants invalides.</p> : null}

      <form action={loginAction} className="form-panel form-grid">
        <label htmlFor="email">
          Email
          <input id="email" name="email" type="email" required />
        </label>

        <label htmlFor="password">
          Mot de passe
          <input id="password" name="password" type="password" required />
        </label>

        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
