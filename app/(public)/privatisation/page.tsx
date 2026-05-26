import { buildLocalizedPageMetadata } from "@/lib/seo/metadata";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { FormProtectionError, assertFormSubmissionAllowed } from "@/lib/anti-spam/form-protection";
import { getFormSubmissionIdentifier } from "@/lib/anti-spam/request-identifier";
import { resolveLocale } from "@/i18n/locales";
import { privatizationPayloadFromFormData } from "@/lib/privatizations/privatization-form";
import { PrivatizationServiceError } from "@/lib/privatizations/privatization-service";
import { privatizationService } from "@/lib/privatizations/privatization-service-instance";

type PrivatisationPageProps = {
  searchParams: Promise<{ status?: "success" | "error"; message?: string }>;
};

export async function generateMetadata() {
  return buildLocalizedPageMetadata("privatization");
}

export default async function PrivatisationPage({ searchParams }: PrivatisationPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("Privatisation");

  async function createPrivatizationAction(formData: FormData) {
    "use server";
    try {
      const headersList = await headers();
      assertFormSubmissionAllowed({
        formName: "privatisation",
        identifier: getFormSubmissionIdentifier(headersList),
        honeypot: formData.get("website")?.toString()
      });
      const payload = privatizationPayloadFromFormData(formData);
      await privatizationService.create(payload);
    } catch (error) {
      if (error instanceof PrivatizationServiceError || error instanceof FormProtectionError) {
        redirect(`/privatisation?status=error&message=${encodeURIComponent(error.message)}`);
      }
      throw error;
    }
    redirect("/privatisation?status=success");
  }

  if (params.status === "success") {
    return (
      <main className="page-shell rclub-form-page">
        <div data-testid="privatisation-success" className="rclub-success-panel">
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
        <p data-testid="privatisation-error" className="status status-error">
          {params.message ?? t("errorDefault")}
        </p>
      )}

      <form action={createPrivatizationAction} className="rclub-form">
        <div aria-hidden="true" className="sr-trap">
          <label htmlFor="privatisation_website">{t("honeypotLabel")}</label>
          <input id="privatisation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* ── Section : Identité ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionIdentity")}</span></div>
          <div className="rclub-grid-2">
            <label className="rclub-field" htmlFor="full_name">
              <span className="rclub-label">{t("fullName")}</span>
              <input
                id="full_name"
                name="full_name"
                required
                minLength={2}
                className="rclub-input"
                autoComplete="name"
                placeholder="Jean Dupont"
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
            <label className="rclub-field" htmlFor="guest_count">
              <span className="rclub-label">{t("guestCount")}</span>
              <input
                id="guest_count"
                name="guest_count"
                type="number"
                min={1}
                required
                className="rclub-input"
                placeholder="50"
              />
            </label>
          </div>
        </div>

        {/* ── Section : Type d'événement ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionEventType")}</span></div>
          <div className="rclub-event-tiles" role="radiogroup" aria-label={t("eventType")}>
            {[
              { value: "anniversaire", label: t("eventTypeAnniversaire") },
              { value: "entreprise", label: t("eventTypeEntreprise") },
              { value: "evjf_evg", label: t("eventTypeEvjfEvg") },
              { value: "soiree_privee", label: t("eventTypeSoireePrivee") },
              { value: "autre", label: t("eventTypeAutre") }
            ].map(({ value, label }) => (
              <div key={value} className="rclub-event-tile">
                <input type="radio" id={`event_type_${value}`} name="event_type" value={value} />
                <label htmlFor={`event_type_${value}`} className="rclub-event-tile-label">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section : Détails ── */}
        <div className="rclub-fieldset">
          <div className="rclub-section-legend"><span>{t("sectionDetails")}</span></div>
          <div className="rclub-grid-2">
            <label className="rclub-field" htmlFor="event_date">
              <span className="rclub-label">{t("eventDate")}</span>
              <input
                id="event_date"
                name="event_date"
                type="date"
                className="rclub-input rclub-input-date"
              />
            </label>
            <label className="rclub-field" htmlFor="budget_range">
              <span className="rclub-label">{t("budgetRange")}</span>
              <input
                id="budget_range"
                name="budget_range"
                className="rclub-input"
                placeholder={t("budgetPlaceholder")}
              />
            </label>
          </div>
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
              rows={5}
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
