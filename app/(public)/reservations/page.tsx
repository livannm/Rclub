import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { FormProtectionError, assertFormSubmissionAllowed } from "@/lib/anti-spam/form-protection";
import { getFormSubmissionIdentifier } from "@/lib/anti-spam/request-identifier";
import { resolveLocale } from "@/i18n/locales";
import { reservationPayloadFromFormData } from "@/lib/reservations/reservation-form";
import { ReservationServiceError } from "@/lib/reservations/reservation-service";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { sendNewReservationAdminEmail } from "@/lib/email/reservation-emails";
import { DatePickerWithEventHint } from "@/components/reservations/DatePickerWithEventHint";

type ReservationsPageProps = {
  searchParams: Promise<{ status?: "success" | "error"; message?: string; date?: string }>;
};

export async function generateMetadata() {
  return buildLocalizedPageMetadata("reservations");
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Reservations");

  async function createReservationAction(formData: FormData) {
    "use server";
    try {
      const headersList = await headers();
      assertFormSubmissionAllowed({
        formName: "reservation",
        identifier: getFormSubmissionIdentifier(headersList),
        honeypot: formData.get("website")?.toString()
      });
      const firstName = formData.get("first_name")?.toString() ?? "";
      const lastName = formData.get("last_name")?.toString() ?? "";
      formData.set("full_name", [firstName, lastName].filter(Boolean).join(" "));
      const payload = reservationPayloadFromFormData(formData);
      const created = await reservationService.create(payload);

      try {
        await sendNewReservationAdminEmail(created);
      } catch (emailError) {
        // Non-blocking: the reservation is saved even if the recap email fails.
        console.error("[reservations] échec de l'email de récap admin:", emailError);
      }
    } catch (error) {
      if (error instanceof ReservationServiceError || error instanceof FormProtectionError) {
        redirect(`/reservations?status=error&message=${encodeURIComponent(error.message)}`);
      }
      throw error;
    }
    redirect("/reservations?status=success");
  }

  if (params.status === "success") {
    return (
      <main className="page-shell rclub-form-page">
        <div data-testid="reservation-success" className="rclub-success-panel">
          <div className="rclub-success-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="rclub-success-kicker">{t("successKicker")}</p>
          <h1 className="rclub-success-title">{t("successTitle")}</h1>
          <p className="rclub-success-sub">{t("successSubtext")}</p>
          <a href="/" className="rclub-success-back">{t("backToHome")}</a>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell page-shell-narrow rclub-form-page">
      <header className="rclub-form-header">
        <p className="page-kicker">Rclub</p>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-lead">{t("lead")}</p>
      </header>

      {params.status === "error" && (
        <p data-testid="reservation-error" className="status status-error">
          {params.message ?? t("errorDefault")}
        </p>
      )}

      <form action={createReservationAction} className="rclub-form">
        <div aria-hidden="true" className="sr-trap">
          <label htmlFor="reservation_website">{t("honeypotLabel")}</label>
          <input id="reservation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* ── Section : Identité ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionIdentity")}</span></div>
          <div className="rclub-grid-2">
            <label className="rclub-field" htmlFor="first_name">
              <span className="rclub-label">{t("firstName")}</span>
              <input
                id="first_name"
                name="first_name"
                required
                className="rclub-input"
                autoComplete="given-name"
                placeholder="Jean"
              />
            </label>
            <label className="rclub-field" htmlFor="last_name">
              <span className="rclub-label">{t("lastName")}</span>
              <input
                id="last_name"
                name="last_name"
                required
                className="rclub-input"
                autoComplete="family-name"
                placeholder="Dupont"
              />
            </label>
            <label className="rclub-field" htmlFor="email">
              <span className="rclub-label">{t("email")}</span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rclub-input"
                autoComplete="email"
                placeholder="jean@exemple.fr"
              />
            </label>
            <label className="rclub-field" htmlFor="phone">
              <span className="rclub-label">{t("phone")}</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="rclub-input"
                autoComplete="tel"
                placeholder="+33 6 00 00 00 00"
              />
            </label>
          </div>
        </div>

        {/* ── Section : La soirée ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionEvening")}</span></div>
          <div className="rclub-grid-2">
            <DatePickerWithEventHint
              labelText={t("dateRequested")}
              locale={locale}
              defaultValue={params.date}
            />
            <label className="rclub-field" htmlFor="arrival_time">
              <span className="rclub-label">{t("arrivalTime")}</span>
              <select
                id="arrival_time"
                name="arrival_time"
                required
                className="rclub-input rclub-select"
              >
                <option value="">{t("arrivalTimePlaceholder")}</option>
                <option value="22:00">22h00</option>
                <option value="22:30">22h30</option>
                <option value="23:00">23h00</option>
                <option value="23:30">23h30</option>
                <option value="00:00">00h00</option>
                <option value="00:30">00h30</option>
                <option value="01:00">01h00</option>
              </select>
            </label>
            <label className="rclub-field" htmlFor="guest_count">
              <span className="rclub-label">{t("guestCount")}</span>
              <input
                id="guest_count"
                name="guest_count"
                type="number"
                min={1}
                max={50}
                required
                className="rclub-input"
                placeholder="2"
              />
            </label>
          </div>
        </div>

        {/* ── Section : Type de table ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionTable")}</span></div>
          <div className="rclub-table-tiles" role="radiogroup" aria-label={t("tableType")}>

            <div className="rclub-table-tile">
              <input type="radio" id="table_classique" name="table_type" value="classique" />
              <label htmlFor="table_classique" className="rclub-table-tile-label">
                <span className="rclub-tile-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <rect x="6" y="13" width="20" height="3" />
                    <line x1="10" y1="16" x2="10" y2="24" />
                    <line x1="22" y1="16" x2="22" y2="24" />
                  </svg>
                </span>
                <span className="rclub-tile-name">{t("tableClassique")}</span>
                <span className="rclub-tile-sub">{t("tableClassiqueSub")}</span>
              </label>
            </div>

            <div className="rclub-table-tile">
              <input type="radio" id="table_prestige" name="table_type" value="prestige" />
              <label htmlFor="table_prestige" className="rclub-table-tile-label">
                <span className="rclub-tile-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M4 22v-5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v5" />
                    <path d="M2 22h28" />
                    <path d="M6 14v-3h20v3" />
                    <circle cx="16" cy="8" r="2" strokeWidth="1.2" />
                  </svg>
                </span>
                <span className="rclub-tile-name">{t("tablePrestige")}</span>
                <span className="rclub-tile-sub">{t("tablePrestigeSub")}</span>
              </label>
            </div>

            <div className="rclub-table-tile">
              <input type="radio" id="table_vip" name="table_type" value="vip" />
              <label htmlFor="table_vip" className="rclub-table-tile-label">
                <span className="rclub-tile-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M16 5L27 16L16 27L5 16Z" />
                    <line x1="5" y1="16" x2="27" y2="16" strokeOpacity="0.25" />
                    <line x1="16" y1="5" x2="16" y2="27" strokeOpacity="0.25" />
                  </svg>
                </span>
                <span className="rclub-tile-name">{t("tableVip")}</span>
                <span className="rclub-tile-sub">{t("tableVipSub")}</span>
              </label>
            </div>

          </div>
        </div>

        {/* ── Section : Occasion spéciale ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionOccasion")}</span></div>
          <label className="rclub-field" htmlFor="occasion_type">
            <span className="rclub-label">{t("occasionLabel")}</span>
            <select
              id="occasion_type"
              name="occasion_type"
              className="rclub-input rclub-select rclub-select--occasion"
            >
              <option value="">{t("occasionPlaceholder")}</option>
              <option value="evg">{t("occasionEvg")}</option>
              <option value="evjf">{t("occasionEvjf")}</option>
              <option value="anniversaire">{t("occasionAnniversaire")}</option>
              <option value="autre">{t("occasionAutre")}</option>
            </select>
          </label>
        </div>

        {/* ── Section : Message ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionMessage")}</span></div>
          <label className="rclub-field" htmlFor="message">
            <span className="rclub-label">{t("message")}</span>
            <textarea
              id="message"
              name="message"
              maxLength={2000}
              rows={4}
              className="rclub-input rclub-textarea"
              placeholder={t("messagePlaceholder")}
            />
          </label>
        </div>

        <input type="hidden" name="source_locale" value={locale} />

        <label htmlFor="consent_rgpd" className="rclub-consent">
          <input id="consent_rgpd" name="consent_rgpd" type="checkbox" required />
          <span>{t("consent")}</span>
        </label>

        <button type="submit" className="rclub-submit">
          <span>{t("submit")}</span>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
            <path d="M4 10h12M11 4l6 6-6 6" />
          </svg>
        </button>
      </form>
    </main>
  );
}
