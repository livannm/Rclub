import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function HomeFinalCta() {
  const t = await getTranslations("HomeSections");

  return (
    <section aria-label={t("ctaTitle")} className="home-final-cta">
      <div className="home-section">
        <div className="home-final-cta-inner">
          <h2 className="home-final-cta-title">{t("ctaTitle")}</h2>
          <p className="home-final-cta-desc">{t("ctaDescription")}</p>
          <div className="home-final-cta-actions">
            <Link href="/reservations" className="button">
              {t("ctaReserve")}
            </Link>
            <Link href="/privatisation" className="button button-secondary">
              {t("ctaPrivatise")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
