import Image from "next/image";
import { getTranslations } from "next-intl/server";

// 1×1 dark pixel (#171717) — fallback si une image n'est pas disponible
const DARK_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxNzE3MTciLz48L3N2Zz4=";

// NOTE: Les images secondaires sont des placeholders events.
// Remplacer par des photos club définitives quand disponibles.
const SECONDARY_IMAGES = [
  { src: "/media/events/r-family.png", key: "img2" },
  { src: "/media/events/legend-r.png", key: "img3" },
] as const;

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
              placeholder="blur"
              blurDataURL={DARK_BLUR_PLACEHOLDER}
            />
            <div className="home-inside-main-overlay" aria-hidden="true" />
            <div className="home-inside-main-text">
              <h2 className="home-inside-main-title">{t("insideTitle")}</h2>
            </div>
          </div>
          <div className="home-inside-secondaries">
            {SECONDARY_IMAGES.map((img, i) => (
              <div key={img.key} className="home-inside-secondary">
                <Image
                  src={img.src}
                  alt={t(i === 0 ? "insideImage2Alt" : "insideImage3Alt")}
                  width={600}
                  height={600}
                  className="home-inside-secondary-image"
                  sizes="(max-width: 767px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={DARK_BLUR_PLACEHOLDER}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
