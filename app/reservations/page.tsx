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

type ReservationsPageProps = {
  searchParams: Promise<{ status?: "success" | "error"; message?: string }>;
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
      const payload = reservationPayloadFromFormData(formData);
      await reservationService.create(payload);
    } catch (error) {
      if (error instanceof ReservationServiceError || error instanceof FormProtectionError) {
        redirect(`/reservations?status=error&message=${encodeURIComponent(error.message)}`);
      }

      throw error;
    }

    redirect("/reservations?status=success");
  }

  return (
    <main className="page-shell page-shell-narrow">
      <p className="page-kicker">Rclub</p>
      <h1 className="page-title">{t("title")}</h1>
      <p className="page-lead">{t("lead")}</p>
      {params.status === "success" ? (
        <p data-testid="reservation-success" className="status status-success">
          {t("success")}
        </p>
      ) : null}
      {params.status === "error" ? (
        <p data-testid="reservation-error" className="status status-error">
          {params.message ?? t("errorDefault")}
        </p>
      ) : null}

      <form action={createReservationAction} className="form-panel form-grid two-column">
        <div aria-hidden="true" className="sr-trap">
          <label htmlFor="reservation_website">{t("honeypotLabel")}</label>
          <input id="reservation_website" name="website" tabIndex={-1} autoComplete="off" />
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

        <label htmlFor="date_requested" className="full-span">
          {t("dateRequested")}
          <input id="date_requested" name="date_requested" type="date" />
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
