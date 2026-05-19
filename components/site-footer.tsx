import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getClubContact } from "@/lib/site/contact";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const contact = getClubContact();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="site-footer-kicker">Rclub</p>
          <p className="site-footer-tagline">{t("tagline")}</p>
        </div>

        <div className="site-footer-grid">
          <section aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="site-footer-heading">
              {t("contactTitle")}
            </h2>
            <dl className="site-footer-contact">
              <div className="site-footer-contact-row">
                <dt>{t("instagramLabel")}</dt>
                <dd>
                  <a
                    href={contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="footer-instagram"
                  >
                    {contact.instagramHandle}
                  </a>
                </dd>
              </div>
              <div className="site-footer-contact-row">
                <dt>{t("phoneLabel")}</dt>
                <dd>
                  <a href={contact.phoneHref} data-testid="footer-phone">
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="site-footer-contact-row">
                <dt>{t("addressLabel")}</dt>
                <dd>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="footer-address"
                  >
                    {contact.address}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="site-footer-heading">
              {t("navTitle")}
            </h2>
            <ul className="site-footer-list">
              <li>
                <Link href="/agenda">{t("agenda")}</Link>
              </li>
              <li>
                <Link href="/galerie">{t("gallery")}</Link>
              </li>
              <li>
                <Link href="/reservations">{t("reservations")}</Link>
              </li>
              <li>
                <Link href="/privatisation">{t("privatisation")}</Link>
              </li>
              <li>
                <Link href="/contact">{t("contact")}</Link>
              </li>
            </ul>
          </section>
        </div>

        <p className="site-footer-copy">{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
