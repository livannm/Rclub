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
    <main style={{ padding: "2rem", maxWidth: "420px" }}>
      <h1>Connexion admin</h1>
      <p>Utilise les identifiants admin configures en environnement.</p>
      {showError ? <p style={{ color: "#f87171" }}>Identifiants invalides.</p> : null}

      <form action={loginAction} style={{ display: "grid", gap: "0.75rem" }}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" required />

        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
