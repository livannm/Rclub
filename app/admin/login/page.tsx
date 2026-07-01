import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import {
  adminAuthSetupErrorMessage,
  getAdminAuthSetupError,
} from "@/lib/auth/admin-auth-env";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";
  const setupError = getAdminAuthSetupError();
  const showInvalidCredentials = params.error === "CredentialsSignin";
  const showConfigurationError = params.error === "Configuration" || Boolean(setupError);

  async function loginAction(formData: FormData) {
    "use server";

    const configError = getAdminAuthSetupError();
    if (configError) {
      redirect(
        `/admin/login?error=Configuration&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(
          `/admin/login?error=${error.type}&callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }

      throw error;
    }

    redirect(callbackUrl);
  }

  return (
    <main className="page-shell page-shell-narrow">
      <p className="page-kicker">Admin</p>
      <h1>Connexion admin</h1>
      <p className="page-lead">Utilisez les identifiants admin configurés en variable d&apos;environnement.</p>
      {showConfigurationError && setupError ? (
        <p className="status status-error">{adminAuthSetupErrorMessage(setupError)}</p>
      ) : null}
      {showInvalidCredentials ? <p className="status status-error">Identifiants invalides.</p> : null}

      <form action={loginAction} className="form-panel form-grid">
        <label htmlFor="email">
          Identifiant
          <input id="email" name="email" type="text" autoComplete="username" required />
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
