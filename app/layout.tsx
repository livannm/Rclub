import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

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
  const t = await getTranslations("Layout");
  const logoUrl = await siteAssetService.getLogo();
  const navLinks = [
    { href: "/", label: t("navAccueil") },
    { href: "/agenda", label: t("navAgenda") },
    { href: "/galerie", label: t("navGalerie") },
    { href: "/reservations", label: t("navReservations") },
    { href: "/privatisation", label: t("navPrivatisation") },
    { href: "/contact", label: t("navContact") },
  ];

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="site-header">
            <Link href="/" aria-label={t("logoAlt")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt=""
                data-testid="site-logo"
                className="site-logo"
              />
            </Link>
            <SiteNav links={navLinks} />
            <LocaleSwitcher />
          </header>
          <div className="site-body">
            {children}
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
