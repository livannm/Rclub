import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FormProtectionError, assertFormSubmissionAllowed } from "@/lib/anti-spam/form-protection";
import { getFormSubmissionIdentifier } from "@/lib/anti-spam/request-identifier";
import { privatizationPayloadFromFormData } from "@/lib/privatizations/privatization-form";
import { PrivatizationServiceError } from "@/lib/privatizations/privatization-service";
import { privatizationService } from "@/lib/privatizations/privatization-service-instance";

type PrivatisationPageProps = {
  searchParams: Promise<{ status?: "success" | "error"; message?: string }>;
};

export default async function PrivatisationPage({ searchParams }: PrivatisationPageProps) {
  const params = await searchParams;

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
    <main style={{ padding: "2rem", maxWidth: "680px" }}>
      <h1>Privatisation</h1>
      <p>Envoyez votre demande de privatisation pour un evenement prive.</p>
      {params.status === "success" ? (
        <p data-testid="privatisation-success" style={{ color: "#4ade80" }}>
          Votre demande de privatisation a ete envoyee avec succes.
        </p>
      ) : null}
      {params.status === "error" ? (
        <p data-testid="privatisation-error" style={{ color: "#f87171" }}>
          {params.message ?? "La demande est invalide."}
        </p>
      ) : null}

      <form action={createPrivatizationAction} style={{ display: "grid", gap: "0.75rem" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
          <label htmlFor="privatisation_website">Site web</label>
          <input id="privatisation_website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label htmlFor="full_name">Nom complet</label>
        <input id="full_name" name="full_name" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="phone">Telephone</label>
        <input id="phone" name="phone" required />

        <label htmlFor="guest_count">Nombre de personnes</label>
        <input id="guest_count" name="guest_count" type="number" min={1} required />

        <label htmlFor="event_date">Date de l&apos;evenement</label>
        <input id="event_date" name="event_date" type="date" />

        <label htmlFor="budget_range">Budget indicatif</label>
        <input id="budget_range" name="budget_range" placeholder="Ex: 5k - 10k EUR" />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" />

        <input type="hidden" name="source_locale" value="fr" />

        <label htmlFor="consent_rgpd">
          <input id="consent_rgpd" name="consent_rgpd" type="checkbox" required /> J&apos;accepte
          le traitement de mes donnees (RGPD)
        </label>

        <button type="submit">Envoyer la demande</button>
      </form>
    </main>
  );
}
