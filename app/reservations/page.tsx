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
    <main style={{ padding: "2rem", maxWidth: "680px" }}>
      <h1>Reservations</h1>
      <p>Fais une demande de reservation pour une soiree ou un service VIP.</p>
      {params.status === "success" ? (
        <p data-testid="reservation-success" style={{ color: "#4ade80" }}>
          Votre demande a ete envoyee avec succes.
        </p>
      ) : null}
      {params.status === "error" ? (
        <p data-testid="reservation-error" style={{ color: "#f87171" }}>
          {params.message ?? "La demande est invalide."}
        </p>
      ) : null}

      <form action={createReservationAction} style={{ display: "grid", gap: "0.75rem" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
          <label htmlFor="reservation_website">Site web</label>
          <input id="reservation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label htmlFor="full_name">Nom complet</label>
        <input id="full_name" name="full_name" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="phone">Telephone</label>
        <input id="phone" name="phone" required />

        <label htmlFor="guest_count">Nombre de personnes</label>
        <input id="guest_count" name="guest_count" type="number" min={1} required />

        <label htmlFor="date_requested">Date souhaitee</label>
        <input id="date_requested" name="date_requested" type="date" />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" />

        <input type="hidden" name="source_locale" value="fr" />

        <label htmlFor="consent_rgpd">
          <input id="consent_rgpd" name="consent_rgpd" type="checkbox" required /> J&apos;accepte
          le traitement de mes donnees (RGPD)
        </label>

        <button type="submit">Envoyer ma demande</button>
      </form>
    </main>
  );
}
