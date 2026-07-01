const LOCALHOST_AUTH_URL = /localhost|127\.0\.0\.1/i;

function readConfiguredAuthUrl(): string | undefined {
  const authUrl = process.env.AUTH_URL?.trim();
  if (authUrl) {
    return authUrl;
  }

  return process.env.NEXTAUTH_URL?.trim();
}

/**
 * NextAuth reads AUTH_URL / NEXTAUTH_URL from the environment. If a localhost
 * value was copied to Vercel by mistake, redirects go to localhost instead of
 * the deployment URL. With trustHost enabled, omitting the URL fixes previews.
 */
export function clearMisconfiguredAuthUrlForVercel(): void {
  if (!process.env.VERCEL) {
    return;
  }

  const configured = readConfiguredAuthUrl();
  if (!configured || !LOCALHOST_AUTH_URL.test(configured)) {
    return;
  }

  delete process.env.AUTH_URL;
  delete process.env.NEXTAUTH_URL;
}

export function isLocalhostAuthUrl(url: string): boolean {
  return LOCALHOST_AUTH_URL.test(url);
}
