import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rclub.fr"),
  title: {
    default: "Rclub Strasbourg - Club premium, soirées et événements",
    template: "%s"
  },
  description:
    "Découvrez Rclub Strasbourg, une expérience nightlife premium avec agenda des soirées, galerie photos, réservations VIP et privatisations.",
  applicationName: "Rclub Strasbourg",
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark"
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
