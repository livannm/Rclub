import { getTranslations } from "next-intl/server";
import { HomeExperienceClient } from "./HomeExperienceClient";

const EXPERIENCE_IMAGES = [
  "/media/hero-poster.png",
  "/media/events/r-family.png",
  "/media/events/legend-r.png",
];

export async function HomeExperience() {
  const t = await getTranslations("HomeSections");

  const blocks = [
    {
      num: t("experience1Num"),
      title: t("experience1Title"),
      desc: t("experience1Desc"),
      image: EXPERIENCE_IMAGES[0],
      imageAlt: t("experience1Title"),
    },
    {
      num: t("experience2Num"),
      title: t("experience2Title"),
      desc: t("experience2Desc"),
      image: EXPERIENCE_IMAGES[1],
      imageAlt: t("experience2Title"),
    },
    {
      num: t("experience3Num"),
      title: t("experience3Title"),
      desc: t("experience3Desc"),
      image: EXPERIENCE_IMAGES[2],
      imageAlt: t("experience3Title"),
    },
  ];

  return (
    <section aria-label={t("experienceTitle")} className="home-experience">
      <div className="home-section">
        <HomeExperienceClient
          eyebrow={t("experienceEyebrow")}
          introTitle={t("experienceTitle")}
          blocks={blocks}
        />
      </div>
    </section>
  );
}
