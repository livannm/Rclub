import { ArrivalTimeSelect } from "@/components/reservations/ArrivalTimeSelect";
import { eventService } from "@/lib/events/events-service-instance";
import { createManualReservationAction } from "@/lib/admin/reservation-actions";

type Props = { searchParams: Promise<Record<string, string>> };

export default async function NewReservationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const allEvents = await eventService.listAll();

  return (
    <main className="admin-shell admin-shell-narrow">
      <header className="admin-header">
        <div>
          <h1>Nouvelle réservation</h1>
        </div>
        <div className="admin-actions">
          <a className="button button-ghost" href="/admin/reservations">
            ← Liste
          </a>
        </div>
      </header>

      {sp.message && (
        <p className="status status-error">{sp.message}</p>
      )}

      <section className="admin-card admin-section">
        <form action={createManualReservationAction} className="admin-form">
          <div className="res-form-grid">
            <label>
              Nom complet *
              <input name="full_name" required minLength={2} placeholder="Jean Dupont" />
            </label>
            <label>
              Email *
              <input name="email" type="email" required placeholder="jean@exemple.fr" />
            </label>
            <label>
              Téléphone *
              <input name="phone" required placeholder="+33 6 00 00 00 00" />
            </label>
            <label>
              Nombre de personnes *
              <input name="guest_count" type="number" min={1} required placeholder="2" />
            </label>
            <label>
              Date souhaitée
              <input name="date_requested" type="date" />
            </label>
            <label>
              Heure d&apos;arrivée
              <ArrivalTimeSelect
                variant="admin"
                placeholder="— Choisir —"
                locale="fr"
              />
            </label>
            <label>
              Événement associé
              <select name="event_id" defaultValue="">
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
                placeholder="Visible uniquement en admin…"
              />
            </label>
          </div>

          <label className="res-notify-label">
            <input type="checkbox" name="notify_client" />
            Envoyer un email de confirmation au client
          </label>

          <div className="admin-form-actions">
            <button type="submit">Créer la réservation</button>
            <a className="button button-ghost" href="/admin/reservations">
              Annuler
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
