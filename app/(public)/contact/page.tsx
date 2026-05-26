import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getClubContact } from "@/lib/site/contact";

export const metadata: Metadata = {
  title: "Contact — Rclub Strasbourg",
  description: "Retrouvez Rclub Strasbourg sur Instagram, Facebook, TikTok, WhatsApp ou venez nous rendre visite au 24 Place des Halles, Strasbourg.",
};

function IconInstagram({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTikTok({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

function IconWhatsApp({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.148-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.558 4.13 1.531 5.876L0 24l6.321-1.499A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.374l-.36-.214-3.75.89.936-3.65-.235-.375A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const contact = getClubContact();

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
          <span className="contact-item-icon">
            <IconInstagram size={26} />
          </span>
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
          <span className="contact-item-icon">
            <IconFacebook size={26} />
          </span>
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
          <span className="contact-item-icon">
            <IconTikTok size={26} />
          </span>
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
          <span className="contact-item-icon">
            <IconWhatsApp size={26} />
          </span>
          <span className="contact-item-body">
            <span className="contact-item-label">{t("writeUs")}</span>
            <span className="contact-item-value">{contact.phoneDisplay}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.phoneHref}
          className="contact-item"
          aria-label={`${t("phone")} — ${contact.phoneDisplay}`}
        >
          <span className="contact-item-icon">
            <Phone size={26} strokeWidth={1.75} />
          </span>
          <span className="contact-item-body">
            <span className="contact-item-label">{t("callUs")}</span>
            <span className="contact-item-value">{contact.phoneDisplay}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>

        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
          aria-label={`${t("address")} — ${contact.address}`}
        >
          <span className="contact-item-icon">
            <MapPin size={26} strokeWidth={1.75} />
          </span>
          <span className="contact-item-body">
            <span className="contact-item-label">{t("findUs")}</span>
            <span className="contact-item-value">{contact.address}</span>
          </span>
          <span className="contact-item-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact-map-wrap">
        <iframe
          title="Rclub Strasbourg — carte"
          src={contact.mapsEmbedUrl}
          width="100%"
          height="380"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="contact-map"
        />
      </div>
      </div>
    </main>
  );
}
