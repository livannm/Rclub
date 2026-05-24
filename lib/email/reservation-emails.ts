import type { ReservationRequest } from "@/lib/reservations/reservation-schema";
import { FROM_EMAIL, getResendClient } from "./resend-client";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function confirmationHtml(reservation: ReservationRequest): string {
  const date = reservation.date_requested
    ? formatDate(reservation.date_requested)
    : reservation.confirmed_at
      ? formatDate(reservation.confirmed_at)
      : "—";

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Confirmation de réservation — Rclub</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;color:#f0e6c8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #2a2218;border-radius:2px;overflow:hidden;">
        <tr><td style="background:#0d0c09;padding:28px 32px;border-bottom:1px solid #2a2218;">
          <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;">R C L U B — S T R A S B O U R G</p>
        </td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f0e6c8;">Réservation confirmée</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#8a7a60;line-height:1.6;">Bonjour ${reservation.full_name},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#b89c6a;line-height:1.6;">Nous avons le plaisir de confirmer votre réservation au Rclub. Voici le récapitulatif :</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2218;border-radius:2px;margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;border-bottom:1px solid #2a2218;width:40%;">Nom</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;border-bottom:1px solid #2a2218;">${reservation.full_name}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;border-bottom:1px solid #2a2218;">Date</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;border-bottom:1px solid #2a2218;">${date}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;">Personnes</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;">${reservation.guest_count}</td>
            </tr>
          </table>

          <p style="margin:0;font-size:13px;color:#8a7a60;line-height:1.6;">À très bientôt,<br><span style="color:#c9a84c;">L'équipe Rclub</span></p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #2a2218;font-size:11px;color:#4a3f2a;text-align:center;">
          7 Quai des Pêcheurs, 67000 Strasbourg
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function refusalHtml(reservation: ReservationRequest): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Demande de réservation — Rclub</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;color:#f0e6c8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #2a2218;border-radius:2px;overflow:hidden;">
        <tr><td style="background:#0d0c09;padding:28px 32px;border-bottom:1px solid #2a2218;">
          <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;">R C L U B — S T R A S B O U R G</p>
        </td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f0e6c8;">Suite à votre demande</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#8a7a60;line-height:1.6;">Bonjour ${reservation.full_name},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#b89c6a;line-height:1.6;">
            Nous vous remercions de l'intérêt que vous portez au Rclub.<br>
            Après examen de votre demande, nous ne sommes malheureusement pas en mesure de vous proposer une réservation pour cette date.
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#b89c6a;line-height:1.6;">
            N'hésitez pas à nous recontacter pour une prochaine soirée.
          </p>
          <p style="margin:0;font-size:13px;color:#8a7a60;line-height:1.6;">Cordialement,<br><span style="color:#c9a84c;">L'équipe Rclub</span></p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #2a2218;font-size:11px;color:#4a3f2a;text-align:center;">
          7 Quai des Pêcheurs, 67000 Strasbourg
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function updateHtml(reservation: ReservationRequest): string {
  const date = reservation.date_requested ? formatDate(reservation.date_requested) : "—";

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Mise à jour de votre réservation — Rclub</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;color:#f0e6c8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #2a2218;border-radius:2px;overflow:hidden;">
        <tr><td style="background:#0d0c09;padding:28px 32px;border-bottom:1px solid #2a2218;">
          <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;">R C L U B — S T R A S B O U R G</p>
        </td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f0e6c8;">Votre réservation mise à jour</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#8a7a60;line-height:1.6;">Bonjour ${reservation.full_name},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#b89c6a;line-height:1.6;">Votre réservation a été modifiée. Voici les nouvelles informations :</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2218;border-radius:2px;margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;border-bottom:1px solid #2a2218;width:40%;">Nom</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;border-bottom:1px solid #2a2218;">${reservation.full_name}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;border-bottom:1px solid #2a2218;">Date</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;border-bottom:1px solid #2a2218;">${date}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a60;">Personnes</td>
              <td style="padding:12px 16px;font-size:14px;color:#f0e6c8;">${reservation.guest_count}</td>
            </tr>
          </table>

          <p style="margin:0;font-size:13px;color:#8a7a60;line-height:1.6;">À très bientôt,<br><span style="color:#c9a84c;">L'équipe Rclub</span></p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #2a2218;font-size:11px;color:#4a3f2a;text-align:center;">
          7 Quai des Pêcheurs, 67000 Strasbourg
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(reservation: ReservationRequest): Promise<void> {
  const resend = getResendClient();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: reservation.email,
    subject: "Votre réservation au Rclub est confirmée",
    html: confirmationHtml(reservation)
  });
}

export async function sendRefusalEmail(reservation: ReservationRequest): Promise<void> {
  const resend = getResendClient();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: reservation.email,
    subject: "Suite à votre demande de réservation — Rclub",
    html: refusalHtml(reservation)
  });
}

export async function sendUpdateEmail(reservation: ReservationRequest): Promise<void> {
  const resend = getResendClient();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: reservation.email,
    subject: "Votre réservation au Rclub a été mise à jour",
    html: updateHtml(reservation)
  });
}
