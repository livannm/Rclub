import { getTranslations } from "next-intl/server";

export async function HomeExperience() {
  const t = await getTranslations("HomeSections");

  const cards = [
    {
      num: t("experience1Num"),
      title: t("experience1Title"),
      desc: t("experience1Desc"),
    },
    {
      num: t("experience2Num"),
      title: t("experience2Title"),
      desc: t("experience2Desc"),
    },
    {
      num: t("experience3Num"),
      title: t("experience3Title"),
      desc: t("experience3Desc"),
    },
  ];

  return (
    <section aria-label={t("experienceTitle")} className="home-experience">
      <div className="home-section">
        <div className="home-experience-header">
          <p className="page-kicker">{t("experienceEyebrow")}</p>
        </div>
        <div className="home-experience-grid">
          {cards.map((card) => (
            <article key={card.num} className="home-experience-card">
              <span className="home-experience-num" aria-hidden="true">
                {card.num}
              </span>
              <span className="home-experience-sep" aria-hidden="true" />
              <h3 className="home-experience-title">{card.title}</h3>
              <p className="home-experience-desc">{card.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
