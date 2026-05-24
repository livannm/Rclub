import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function HomeInsideClub() {
  const t = await getTranslations("HomeSections");

  return (
    <section aria-label={t("insideTitle")} className="home-inside">
      <div className="home-section">
        <div className="home-inside-header">
          <p className="page-kicker">{t("insideEyebrow")}</p>
        </div>
        <div className="home-inside-composition">
          <div className="home-inside-main">
            <Image
              src="/media/hero-poster.png"
              alt={t("insideImage1Alt")}
              width={1200}
              height={750}
              className="home-inside-main-image"
              sizes="(max-width: 767px) 100vw, 66vw"
            />
            <div className="home-inside-main-overlay" aria-hidden="true" />
            <div className="home-inside-main-text">
              <h2 className="home-inside-main-title">{t("insideTitle")}</h2>
            </div>
          </div>
          <div className="home-inside-secondaries">
            <div className="home-inside-secondary">
              <Image
                src="/media/events/r-family.png"
                alt={t("insideImage2Alt")}
                width={600}
                height={600}
                className="home-inside-secondary-image"
                sizes="(max-width: 767px) 50vw, 33vw"
              />
            </div>
            <div className="home-inside-secondary">
              <Image
                src="/media/events/legend-r.png"
                alt={t("insideImage3Alt")}
                width={600}
                height={600}
                className="home-inside-secondary-image"
                sizes="(max-width: 767px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
