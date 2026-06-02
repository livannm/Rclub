import { notFound } from "next/navigation";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { isExpiredReservation } from "@/lib/reservations/reservation-groups";
import {
  cancelReservationAction,
  confirmReservationAction,
  refuseReservationAction,
  updateReservationAction
} from "@/lib/admin/reservation-actions";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> };

export default async function ReservationDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const [reservation, allEvents] = await Promise.all([
    reservationService.findById(id),
    eventService.listAll()
  ]);

  if (!reservation) notFound();

  const eventDate = reservation.event_id
    ? allEvents.find((e) => e.id === reservation.event_id)?.starts_at
    : reservation.date_requested;
  const expired = isExpiredReservation(
    reservation.status,
    eventDate ? new Date(eventDate) : null,
  );

  const isEditable = !expired && (reservation.status === "new" || reservation.status === "confirmed");
  const canDecide = !expired && reservation.status === "new";
  const canCancel = reservation.status === "confirmed";

  return (
    <main className="admin-shell admin-shell-narrow">
      <header className="admin-header">
        <div>
          <h1>{reservation.full_name}</h1>
          <span className={`res-row-status res-status-${expired ? "refused" : reservation.status}`}>
            {expired ? "Expirée (non traitée)" : statusLabel(reservation.status)}
          </span>
        </div>
        <div className="admin-actions">
          <a className="button button-ghost" href="/admin/reservations">
            ← Liste
          </a>
        </div>
      </header>

      {sp.confirmed === "1" && (
        <p className="status status-success">Réservation confirmée. Email envoyé au client.</p>
      )}
      {sp.refused === "1" && (
        <p className="status status-success">Demande refusée. Email envoyé au client.</p>
      )}
      {sp.cancelled === "1" && (
        <p className="status status-success">Réservation annulée. Email envoyé au client.</p>
      )}
      {sp.saved === "1" && (
        <p className="status status-success">Modifications enregistrées.</p>
      )}
      {sp.message && (
        <p className="status status-error">{sp.message}</p>
      )}

      {/* Fiche récap */}
      <section className="admin-card admin-section">
        <h2>Informations</h2>
        <dl className="res-detail-grid">
          <dt>Nom</dt><dd>{reservation.full_name}</dd>
          <dt>Email</dt><dd><a href={`mailto:${reservation.email}`}>{reservation.email}</a></dd>
          <dt>Téléphone</dt><dd>{reservation.phone}</dd>
          <dt>Personnes</dt><dd>{reservation.guest_count}</dd>
          <dt>Date demandée</dt><dd>{reservation.date_requested ?? "—"}</dd>
          {reservation.arrival_time && (
            <><dt>Heure d&apos;arrivée</dt><dd>{reservation.arrival_time}</dd></>
          )}
          {reservation.table_type && (
            <><dt>Type de table</dt><dd>{tableTypeLabel(reservation.table_type)}</dd></>
          )}
          {reservation.occasion_type && (
            <><dt>Occasion</dt><dd>{occasionTypeLabel(reservation.occasion_type)}</dd></>
          )}
          {reservation.message && (
            <><dt>Message</dt><dd style={{ whiteSpace: "pre-wrap" }}>{reservation.message}</dd></>
          )}
          <dt>Statut</dt><dd>{expired ? "Expirée (non traitée)" : statusLabel(reservation.status)}</dd>
          <dt>Créé le</dt><dd>{new Date(reservation.created_at).toLocaleString("fr-FR")}</dd>
          {reservation.confirmed_at && (
            <><dt>Confirmé le</dt><dd>{new Date(reservation.confirmed_at).toLocaleString("fr-FR")}</dd></>
          )}
          {reservation.refused_at && (
            <><dt>Refusé le</dt><dd>{new Date(reservation.refused_at).toLocaleString("fr-FR")}</dd></>
          )}
          {reservation.cancelled_at && (
            <><dt>Annulé le</dt><dd>{new Date(reservation.cancelled_at).toLocaleString("fr-FR")}</dd></>
          )}
          {reservation.admin_notes && (
            <><dt>Notes admin</dt><dd style={{ whiteSpace: "pre-wrap" }}>{reservation.admin_notes}</dd></>
          )}
        </dl>
      </section>

      {/* Actions confirm / refuse */}
      {canDecide && (
        <section className="admin-card admin-section">
          <h2>Décision</h2>
          <div className="res-decision-grid">
            <form action={confirmReservationAction}>
              <input type="hidden" name="reservation_id" value={id} />
              <label className="admin-form" htmlFor={`notes-confirm-${id}`}>
                Note interne (optionnel)
                <textarea
                  id={`notes-confirm-${id}`}
                  name="admin_notes"
                  defaultValue={reservation.admin_notes ?? ""}
                  rows={3}
                  placeholder="Visible uniquement en admin…"
                />
              </label>
              <button type="submit" className="button res-btn-confirm">
                Confirmer et notifier le client
              </button>
            </form>

            <form action={refuseReservationAction}>
              <input type="hidden" name="reservation_id" value={id} />
              <label className="admin-form" htmlFor={`notes-refuse-${id}`}>
                Note interne (optionnel)
                <textarea
                  id={`notes-refuse-${id}`}
                  name="admin_notes"
                  defaultValue={reservation.admin_notes ?? ""}
                  rows={3}
                  placeholder="Visible uniquement en admin…"
                />
              </label>
              <button type="submit" className="button-secondary res-btn-refuse">
                Refuser et notifier le client
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Formulaire modification */}
      {isEditable && (
        <section className="admin-card admin-section">
          <h2>Modifier la réservation</h2>
          <form action={updateReservationAction} className="admin-form">
            <input type="hidden" name="reservation_id" value={id} />

            <div className="res-form-grid">
              <label>
                Nom complet
                <input name="full_name" defaultValue={reservation.full_name} required minLength={2} />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue={reservation.email} required />
              </label>
              <label>
                Téléphone
                <input name="phone" defaultValue={reservation.phone} required />
              </label>
              <label>
                Nombre de personnes
                <input name="guest_count" type="number" min={1} defaultValue={reservation.guest_count} required />
              </label>
              <label>
                Date souhaitée
                <input
                  name="date_requested"
                  type="date"
                  defaultValue={reservation.date_requested ?? ""}
                />
              </label>
              <label>
                Événement associé
                <select name="event_id" defaultValue={reservation.event_id ?? ""}>
                  <option value="">— Aucun événement —</option>
                  {allEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title_fr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-span">
                Notes internes
                <textarea
                  name="admin_notes"
                  rows={3}
                  defaultValue={reservation.admin_notes ?? ""}
                  placeholder="Visible uniquement en admin…"
                />
              </label>
            </div>

            {reservation.status === "confirmed" && (
              <label className="res-notify-label">
                <input type="checkbox" name="notify_client" />
                Notifier le client par email des modifications
              </label>
            )}

            <div className="admin-form-actions">
              <button type="submit">Enregistrer</button>
            </div>
          </form>
        </section>
      )}

      {canCancel && (
        <section className="admin-card admin-section res-danger-zone">
          <h2>Annuler la réservation</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
            La réservation a déjà été confirmée. Annulez-la si l'événement ne peut finalement pas avoir lieu — un email sera envoyé au client.
          </p>
          <form action={cancelReservationAction}>
            <input type="hidden" name="reservation_id" value={id} />
            <label className="admin-form" htmlFor={`notes-cancel-${id}`}>
              Motif interne (optionnel)
              <textarea
                id={`notes-cancel-${id}`}
                name="admin_notes"
                defaultValue={reservation.admin_notes ?? ""}
                rows={3}
                placeholder="Raison de l'annulation, visible uniquement en admin…"
              />
            </label>
            <label className="res-notify-label">
              <input type="checkbox" name="notify_client" defaultChecked />
              Notifier le client par email
            </label>
            <button type="submit" className="button-secondary res-btn-cancel">
              Annuler la réservation
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case "new": return "Nouvelle demande";
    case "confirmed": return "Confirmée";
    case "refused": return "Refusée";
    case "cancelled": return "Annulée";
    default: return status;
  }
}

function tableTypeLabel(value: string): string {
  switch (value) {
    case "classique": return "Table Classique";
    case "prestige": return "Table Prestige";
    case "vip": return "Carré VIP";
    default: return value;
  }
}

function occasionTypeLabel(value: string): string {
  switch (value) {
    case "evg": return "EVG";
    case "evjf": return "EVJF";
    case "anniversaire": return "Anniversaire";
    case "autre": return "Autre occasion";
    default: return value;
  }
}
