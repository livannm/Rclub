import { getTranslations } from "next-intl/server";
import { getClubContact } from "@/lib/site/contact";
import { HomePracticalInfoClient } from "./HomePracticalInfoClient";

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
        <HomePracticalInfoClient
          title={t("practicalTitle")}
          items={items}
          ctaReserve={t("practicalCtaReserve")}
          ctaDirections={t("practicalCtaDirections")}
          mapsUrl={contact.mapsUrl}
        />
      </div>
    </section>
  );
}
