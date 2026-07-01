import {
  addReservationNotifyEmailAction,
  removeReservationNotifyEmailAction
} from "@/lib/admin/reservation-notify-actions";
import { getContactEmail } from "@/lib/email/resend-client";
import { reservationNotifyService } from "@/lib/reservation-notify/reservation-notify-service-instance";
import { requireAdminSession } from "@/lib/auth/session";

type NotificationsPageProps = {
  searchParams: Promise<{ added?: string; removed?: string; message?: string }>;
};

export default async function ReservationNotificationsPage({
  searchParams
}: NotificationsPageProps) {
  await requireAdminSession();
  const params = await searchParams;
  const emails = await reservationNotifyService.listEmails();
  const envFallback = getContactEmail();

  return (
    <main className="admin-shell">
      <div className="admin-page-bar">
        <div>
          <h1 className="admin-page-title">Notifications réservation</h1>
          <p className="admin-page-subtitle">
            Chaque nouvelle demande depuis le site envoie un email récapitulatif à ces adresses.
          </p>
        </div>
        <div className="admin-actions">
          <a className="button button-secondary" href="/admin/reservations">
            Retour aux réservations
          </a>
        </div>
      </div>

      {params.added === "1" ? (
        <p className="status status-success">Adresse ajoutée à la liste.</p>
      ) : null}
      {params.removed === "1" ? (
        <p className="status status-success">Adresse retirée de la liste.</p>
      ) : null}
      {params.message ? <p className="status status-error">{params.message}</p> : null}

      <section aria-labelledby="notify-list-heading" className="admin-section">
        <h2 id="notify-list-heading" className="admin-section-title">
          Destinataires actifs
        </h2>
        <div className="admin-card">
          {emails.length === 0 ? (
            <p className="admin-empty">
              Aucune adresse configurée dans l&apos;admin.
              {envFallback ? (
                <>
                  {" "}
                  Les notifications partent vers <strong>{envFallback}</strong> via{" "}
                  <code>RESEND_CONTACT_TO</code>.
                </>
              ) : (
                <> Aucun email ne sera envoyé tant qu&apos;aucune adresse n&apos;est définie.</>
              )}
            </p>
          ) : (
            <ul className="admin-user-list">
              {emails.map((email) => (
                <li key={email} className="admin-user-list-item">
                  <div>
                    <strong>{email}</strong>
                  </div>
                  <form action={removeReservationNotifyEmailAction}>
                    <input type="hidden" name="email" value={email} />
                    <button type="submit" className="button button-secondary">
                      Retirer
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="notify-add-heading" className="admin-section">
        <h2 id="notify-add-heading" className="admin-section-title">
          Ajouter une adresse
        </h2>
        <form action={addReservationNotifyEmailAction} className="admin-card admin-form form-grid">
          <label htmlFor="notify_email">
            Email
            <input
              id="notify_email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="reservations@exemple.fr"
              required
            />
          </label>
          <button type="submit">Ajouter</button>
        </form>
      </section>
    </main>
  );
}
