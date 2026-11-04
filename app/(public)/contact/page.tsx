import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OptimizedImage as Image } from "@/components/media/MediaImage";
import { ClubMap } from "@/components/contact/ClubMap";
import { getClubContact } from "@/lib/site/contact";
import { getClubPlaceConfig } from "@/lib/site/club-place";

export const metadata: Metadata = {
  title: "Contact — Rclub Strasbourg",
  description: "Retrouvez Rclub Strasbourg sur Instagram, Facebook, TikTok, WhatsApp, par email à contact@r-club.fr ou venez nous rendre visite au 24 Place des Halles, Strasbourg.",
};

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const contact = getClubContact();
  const placeConfig = getClubPlaceConfig();

  return (
    <main>
      <div className="contact-hero">
        <Image
          src="/media/club/exterieur1.jpg"
          alt=""
          fill
          className="contact-hero-img"
          priority
          sizes="100vw"
        />
        <div className="contact-hero-overlay" aria-hidden="true" />
        <div className="contact-hero-content">
          <p className="contact-hero-kicker">{t("kicker")}</p>
          <h1 className="contact-hero-title">{t("title")}</h1>
          <p className="contact-hero-lead">{t("description")}</p>
        </div>
      </div>

      <div className="page-shell page-shell-narrow contact-body">
      <div className="contact-methods">
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("instagram")} — ${contact.instagramHandle}`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("followUs")}</span>
            <span className="contact-item-value">{contact.instagramHandle}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("facebook")} — Rclub Strasbourg`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("followUsFacebook")}</span>
            <span className="contact-item-value">facebook.com/rclubstrasbourg</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("tiktok")} — ${contact.tiktokHandle}`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("followUsTikTok")}</span>
            <span className="contact-item-value">{contact.tiktokHandle}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("whatsapp")} — ${contact.phoneDisplay}`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("writeUs")}</span>
            <span className="contact-item-value">{contact.phoneDisplay}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.emailHref}
          className="contact-item"
          aria-label={`${t("email")} — ${contact.email}`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("emailUs")}</span>
            <span className="contact-item-value">{contact.email}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        {contact.phones.map((phone) => (
          <a
            key={phone.href}
            href={phone.href}
            className="contact-item"
            data-testid={phone.kind === "landline" ? "contact-landline" : "contact-phone"}
            aria-label={
              phone.kind === "landline"
                ? `${t("landline")} — ${phone.display}. ${t("landlineNote")}`
                : `${t("phone")} — ${phone.display}`
            }
          >
            <span className="contact-item-body">
              <span className="contact-item-label">
                {phone.kind === "landline" ? t("landline") : t("callUs")}
              </span>
              <span className="contact-item-value">{phone.display}</span>
              {phone.kind === "landline" ? (
                <span className="contact-item-note">{t("landlineNote")}</span>
              ) : null}
            </span>
            <span className="contact-item-arrow" aria-hidden="true">↗</span>
          </a>
        ))}

        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("address")} — ${contact.address}`}
        >
          <span className="contact-item-body">
            <span className="contact-item-label">{t("findUs")}</span>
            <span className="contact-item-value">{contact.address}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact-map-wrap">
        <ClubMap
          apiKey={placeConfig.apiKey}
          placeId={placeConfig.placeId}
          searchQuery={placeConfig.searchQuery}
          fallbackLat={placeConfig.coords.lat}
          fallbackLng={placeConfig.coords.lng}
          fallbackEmbedUrl={contact.mapsEmbedUrl}
          title="Rclub Strasbourg — carte"
        />
      </div>
      </div>
    </main>
  );
}
