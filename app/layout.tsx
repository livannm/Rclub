import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://r-club.fr"),
  title: {
    default: "R Club Strasbourg | Discothèque, soirées et tables VIP",
    template: "%s"
  },
  description:
    "Découvrez le R Club, discothèque au cœur de Strasbourg : DJ sets, soirées à thème et tables VIP. Consultez le programme et réservez votre prochaine soirée.",
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

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
