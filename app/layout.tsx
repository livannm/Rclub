import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rclub",
  description: "Site du club - MVP en construction"
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const logoUrl = await siteAssetService.getLogo();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo Rclub"
              data-testid="site-logo"
              style={{ height: "40px", width: "auto" }}
            />
            <LocaleSwitcher />
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
