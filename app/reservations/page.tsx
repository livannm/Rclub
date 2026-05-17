import { buildPageMetadata } from "@/lib/seo/metadata";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FormProtectionError, assertFormSubmissionAllowed } from "@/lib/anti-spam/form-protection";
import { getFormSubmissionIdentifier } from "@/lib/anti-spam/request-identifier";
import { reservationPayloadFromFormData } from "@/lib/reservations/reservation-form";
import { ReservationServiceError } from "@/lib/reservations/reservation-service";
import { reservationService } from "@/lib/reservations/reservation-service-instance";

type ReservationsPageProps = {
  searchParams: Promise<{ status?: "success" | "error"; message?: string }>;
};

export const metadata = buildPageMetadata("reservations");

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const params = await searchParams;

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
      <h1>Reservations</h1>
      <p className="page-lead">Fais une demande de reservation pour une soiree ou un service VIP.</p>
      {params.status === "success" ? (
        <p data-testid="reservation-success" className="status status-success">
          Votre demande a ete envoyee avec succes.
        </p>
      ) : null}
      {params.status === "error" ? (
        <p data-testid="reservation-error" className="status status-error">
          {params.message ?? "La demande est invalide."}
        </p>
      ) : null}

      <form action={createReservationAction} className="form-panel form-grid two-column">
        <div aria-hidden="true" className="sr-trap">
          <label htmlFor="reservation_website">Site web</label>
          <input id="reservation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label htmlFor="full_name">
          Nom complet
          <input id="full_name" name="full_name" required />
        </label>

        <label htmlFor="email">
          Email
          <input id="email" name="email" type="email" required />
        </label>

        <label htmlFor="phone">
          Telephone
          <input id="phone" name="phone" required />
        </label>

        <label htmlFor="guest_count">
          Nombre de personnes
          <input id="guest_count" name="guest_count" type="number" min={1} required />
        </label>

        <label htmlFor="date_requested" className="full-span">
          Date souhaitee
          <input id="date_requested" name="date_requested" type="date" />
        </label>

        <label htmlFor="message" className="full-span">
          Message
          <textarea id="message" name="message" />
        </label>

        <input type="hidden" name="source_locale" value="fr" />

        <label htmlFor="consent_rgpd" className="checkbox-label full-span">
          <input id="consent_rgpd" name="consent_rgpd" type="checkbox" required /> J&apos;accepte
          le traitement de mes donnees (RGPD)
        </label>

        <button type="submit" className="full-span">Envoyer ma demande</button>
      </form>
    </main>
  );
}
