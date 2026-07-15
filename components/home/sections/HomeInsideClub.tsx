import { getTranslations } from "next-intl/server";
import { HomeInsideClubClient } from "./HomeInsideClubClient";

const IMAGES = [
  { src: "/media/club/interieur1.jpg", altKey: "insideImage1Alt" },
  { src: "/media/club/interieur2.jpg", altKey: "insideImage2Alt" },
  { src: "/media/club/interieur3.jpg", altKey: "insideImage3Alt" },
] as const;

export async function HomeInsideClub() {
  const t = await getTranslations("HomeSections");

  const images = IMAGES.map((img) => ({
    src: img.src,
    alt: t(img.altKey),
  }));

  return (
    <section aria-label={t("insideTitle")} className="home-inside">
      <div className="home-section">
        <div className="home-inside-header">
          <p className="page-kicker">{t("insideEyebrow")}</p>
        </div>
        <HomeInsideClubClient
          images={images}
          title={t("insideTitle")}
          closeLabel={t("lightboxClose")}
          prevLabel={t("lightboxPrev")}
          nextLabel={t("lightboxNext")}
          zoomHint={t("lightboxZoomHint")}
        />
      </div>
    </section>
  );
}
