export type AdminAuthSetupError = "MISSING_ADMIN_CREDENTIALS" | "MISSING_AUTH_SECRET";

export function getAdminAuthEnv() {
  return {
    adminEmail: process.env.ADMIN_EMAIL?.trim(),
    adminPassword: process.env.ADMIN_PASSWORD?.trim(),
    authSecret:
      process.env.AUTH_SECRET?.trim() ?? process.env.NEXTAUTH_SECRET?.trim(),
  };
}

/** Returns why admin login cannot work, or null when env is ready. */
export function getAdminAuthSetupError(): AdminAuthSetupError | null {
  const { adminEmail, adminPassword, authSecret } = getAdminAuthEnv();

  if (!adminEmail || !adminPassword) {
    return "MISSING_ADMIN_CREDENTIALS";
  }

  if (!authSecret) {
    return "MISSING_AUTH_SECRET";
  }

  return null;
}

export function adminAuthSetupErrorMessage(error: AdminAuthSetupError): string {
  switch (error) {
    case "MISSING_ADMIN_CREDENTIALS":
      return "Connexion admin indisponible : définissez ADMIN_EMAIL et ADMIN_PASSWORD sur le serveur (Vercel → Environment Variables).";
    case "MISSING_AUTH_SECRET":
      return "Connexion admin indisponible : définissez AUTH_SECRET (ou NEXTAUTH_SECRET) sur le serveur.";
  }
}
