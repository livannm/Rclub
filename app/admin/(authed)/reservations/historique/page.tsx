import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { groupReservationsByEvening } from "@/lib/reservations/reservation-groups";

export default async function AdminReservationsHistoriquePage() {
  const [allReservations, allEvents] = await Promise.all([
    reservationService.listAll(),
    eventService.listAll()
  ]);

  const eventLookup = Object.fromEntries(
    allEvents.map((e) => [e.id, { titleFr: e.title_fr, startsAt: new Date(e.starts_at) }])
  );

  const groups = groupReservationsByEvening(allReservations, eventLookup);
  const pastGroups = groups.filter((g) => !g.upcoming);

  return (
    <main className="admin-shell">
      <div className="admin-page-bar">
        <p className="admin-page-subtitle">Soirées passées et demandes sans date.</p>
        <div className="admin-actions">
          <a className="button button-secondary" href="/admin/reservations">
            Réservations à venir →
          </a>
        </div>
      </div>

      {pastGroups.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Aucun historique pour l'instant.
          </p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="res-groups-header">
            <span>Soirée</span>
            <span>Confirmées</span>
            <span>En attente</span>
            <span>Refusées</span>
            <span>Guests conf.</span>
          </div>

          {pastGroups.map((group) => (
            <a
              key={group.key}
              href={`/admin/reservations/groupe/${group.slug}`}
              className="res-group res-group-link"
            >
              <div className="res-group-heading">
                <h2 className="res-group-label">{group.label}</h2>
                {group.date && (
                  <span className="res-badge-past">
                    {group.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              <div className="res-group-stats">
                <span aria-hidden />
                <span>{group.confirmed}</span>
                <span className={group.pending > 0 ? "res-count-pending" : ""}>{group.pending}</span>
                <span>{group.refused}</span>
                <span className="res-count-guests">{group.totalGuestsConfirmed}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
