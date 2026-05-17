import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminRedirectPath } from "@/lib/auth/guard";

const withAuth = auth((req) => {
  const isAuthenticated = Boolean(req.auth?.user);
  const redirectPath = getAdminRedirectPath(req.nextUrl.pathname, isAuthenticated);

  if (!redirectPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(redirectPath, req.url));
});

export default withAuth;

export const config = {
  matcher: ["/admin/:path*"]
};
