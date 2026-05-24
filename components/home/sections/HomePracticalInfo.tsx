import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getClubContact } from "@/lib/site/contact";

export async function HomePracticalInfo() {
  const t = await getTranslations("HomeSections");
  const contact = getClubContact();

  const items = [
    { label: t("practicalAddressLabel"), value: contact.address },
    { label: t("practicalHoursLabel"), value: t("practicalHoursValue") },
    { label: t("practicalDressCodeLabel"), value: t("practicalDressCodeValue") },
    { label: t("practicalReservationLabel"), value: t("practicalReservationValue") },
  ];

  return (
    <section aria-label={t("practicalTitle")} className="home-practical">
      <div className="home-section">
        <div className="home-practical-header">
          <p className="page-kicker">{t("practicalTitle")}</p>
        </div>
        <div className="home-practical-grid">
          <div className="home-practical-info-frame">
            <dl className="home-practical-info-grid">
              {items.map(({ label, value }) => (
                <div key={label} className="home-practical-item">
                  <dt className="home-practical-label">{label}</dt>
                  <dd className="home-practical-value">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="home-practical-ctas">
            <Link href="/reservations" className="button">
              {t("practicalCtaReserve")}
            </Link>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-practical-link-secondary"
            >
              {t("practicalCtaDirections")}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
