export type AdminAuthSetupError = "MISSING_AUTH_SECRET";

export function getAdminAuthEnv() {
  return {
    authSecret:
      process.env.AUTH_SECRET?.trim() ?? process.env.NEXTAUTH_SECRET?.trim(),
  };
}

/** Returns why admin login cannot work, or null when env is ready. */
export function getAdminAuthSetupError(): AdminAuthSetupError | null {
  const { authSecret } = getAdminAuthEnv();

  if (!authSecret) {
    return "MISSING_AUTH_SECRET";
  }

  return null;
}

export function adminAuthSetupErrorMessage(error: AdminAuthSetupError): string {
  switch (error) {
    case "MISSING_AUTH_SECRET":
      return "Connexion admin indisponible : définissez AUTH_SECRET (ou NEXTAUTH_SECRET) sur le serveur.";
  }
}
