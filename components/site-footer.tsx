import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getClubContact } from "@/lib/site/contact";

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const contact = getClubContact();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">

          <div className="site-footer-brand">
            <p className="site-footer-kicker">Rclub</p>
            <p className="site-footer-tagline">{t("tagline")}</p>
            <div className="site-footer-socials">
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="Facebook">
                <IconFacebook />
              </a>
              <a href={contact.tiktokUrl} target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="TikTok">
                <IconTikTok />
              </a>
            </div>
          </div>

          <section aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="site-footer-heading">
              {t("navTitle")}
            </h2>
            <ul className="site-footer-list">
              <li><Link href="/agenda">{t("agenda")}</Link></li>
              <li><Link href="/galerie">{t("gallery")}</Link></li>
              <li><Link href="/reservations">{t("reservations")}</Link></li>
              <li><Link href="/privatisation">{t("privatisation")}</Link></li>
              <li><Link href="/contact">{t("contact")}</Link></li>
            </ul>
          </section>

          <section aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="site-footer-heading">
              {t("contactTitle")}
            </h2>
            <dl className="site-footer-contact">
              <div className="site-footer-contact-row">
                <dt>{t("phoneLabel")}</dt>
                <dd>
                  {contact.phones.map((phone, index) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      data-testid={index === 0 ? "footer-phone" : undefined}
                    >
                      {phone.display}
                    </a>
                  ))}
                </dd>
              </div>
              <div className="site-footer-contact-row">
                <dt>{t("addressLabel")}</dt>
                <dd>
                  <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" data-testid="footer-address">
                    {contact.address}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

        </div>

        <p className="site-footer-copy">{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
