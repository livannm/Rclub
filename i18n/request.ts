import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, resolveLocale } from "@/i18n/locales";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
