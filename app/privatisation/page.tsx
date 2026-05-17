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

  return (
    <main className="page-shell page-shell-narrow">
      <p className="page-kicker">Rclub</p>
      <h1 className="page-title">{t("title")}</h1>
      <p className="page-lead">{t("lead")}</p>
      {params.status === "success" ? (
        <p data-testid="privatisation-success" className="status status-success">
          {t("success")}
        </p>
      ) : null}
      {params.status === "error" ? (
        <p data-testid="privatisation-error" className="status status-error">
          {params.message ?? t("errorDefault")}
        </p>
      ) : null}

      <form action={createPrivatizationAction} className="form-panel form-grid two-column">
        <div aria-hidden="true" className="sr-trap">
          <label htmlFor="privatisation_website">{t("honeypotLabel")}</label>
          <input id="privatisation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label htmlFor="full_name">
          {t("fullName")}
          <input id="full_name" name="full_name" required />
        </label>

        <label htmlFor="email">
          {t("email")}
          <input id="email" name="email" type="email" required />
        </label>

        <label htmlFor="phone">
          {t("phone")}
          <input id="phone" name="phone" required />
        </label>

        <label htmlFor="guest_count">
          {t("guestCount")}
          <input id="guest_count" name="guest_count" type="number" min={1} required />
        </label>

        <label htmlFor="event_date">
          {t("eventDate")}
          <input id="event_date" name="event_date" type="date" />
        </label>

        <label htmlFor="budget_range">
          {t("budgetRange")}
          <input
            id="budget_range"
            name="budget_range"
            placeholder={t("budgetPlaceholder")}
          />
        </label>

        <label htmlFor="message" className="full-span">
          {t("message")}
          <textarea id="message" name="message" />
        </label>

        <input type="hidden" name="source_locale" value={locale} />

        <label htmlFor="consent_rgpd" className="checkbox-label full-span">
          <input id="consent_rgpd" name="consent_rgpd" type="checkbox" required />
          {t("consent")}
        </label>

        <button type="submit" className="full-span">
          {t("submit")}
        </button>
      </form>
    </main>
  );
}
