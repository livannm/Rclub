const ADMIN_PREFIX = "/admin";
const ADMIN_LOGIN_PATH = "/admin/login";

export function getAdminRedirectPath(
  pathname: string,
  isAuthenticated: boolean
): string | null {
  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isLoginRoute = pathname === ADMIN_LOGIN_PATH;

  if (!isAdminRoute || isLoginRoute || isAuthenticated) {
    return null;
  }

  return `${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`;
}
