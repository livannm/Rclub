import { NextResponse } from "next/server";
import { defaultLocale, resolveLocale } from "@/i18n/locales";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = resolveLocale(url.searchParams.get("locale") ?? defaultLocale);
  const redirectTo = url.searchParams.get("redirectTo") ?? "/";

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set("NEXT_LOCALE", locale, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
