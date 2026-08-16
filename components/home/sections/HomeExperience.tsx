import { getTranslations } from "next-intl/server";
import { HomeExperienceClient } from "./HomeExperienceClient";

const EXPERIENCE_IMAGES = [
  "/media/club/exterieur1.jpg",
  "/media/club/ambiance-dj.jpg",
  "/media/club/ambiance.jpg",
];

export async function HomeExperience() {
  const t = await getTranslations("HomeSections");

  const blocks = [
    {
      num: t("experience1Num"),
      title: t("experience1Title"),
      paragraphs: [t("experience1P1"), t("experience1P2")],
      image: EXPERIENCE_IMAGES[0],
      imageAlt: t("experience1ImageAlt"),
    },
    {
      num: t("experience2Num"),
      title: t("experience2Title"),
      paragraphs: [t("experience2P1"), t("experience2P2")],
      image: EXPERIENCE_IMAGES[1],
      imageAlt: t("experience2ImageAlt"),
    },
    {
      num: t("experience3Num"),
      title: t("experience3Title"),
      paragraphs: [t("experience3P1"), t("experience3P2")],
      image: EXPERIENCE_IMAGES[2],
      imageAlt: t("experience3ImageAlt"),
    },
  ];

  return (
    <section aria-label={t("experienceTitle")} className="home-experience">
      <div className="home-section">
        <HomeExperienceClient
          eyebrow={t("experienceEyebrow")}
          introTitleLead={t("experienceTitleLead")}
          introTitleRest={t("experienceTitleRest")}
          blocks={blocks}
          closer={[t("experienceCloserP1"), t("experienceCloserP2")]}
          signature={{
            brand: t("experienceSignBrand"),
            address: t("experienceSignAddress"),
            parking: t("experienceSignParking"),
            tagline: t("experienceSignTagline"),
          }}
        />
      </div>
    </section>
  );
}
