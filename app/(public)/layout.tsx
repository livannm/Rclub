import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";

export default async function PublicLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const t = await getTranslations("Layout");
  const logoUrl = await siteAssetService.getLogo();
  const navLinks = [
    { href: "/", label: t("navAccueil") },
    { href: "/agenda", label: t("navAgenda") },
    { href: "/galerie", label: t("navGalerie") },
    { href: "/reservations", label: t("navReservations") },
    { href: "/privatisation", label: t("navPrivatisation") },
    { href: "/contact", label: t("navContact") }
  ];

  return (
    <>
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
      </header>
      <div className="site-body">
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
