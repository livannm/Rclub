import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { groupReservationsByEvening } from "@/lib/reservations/reservation-groups";

export default async function AdminReservationsPage() {
  const [allReservations, allEvents] = await Promise.all([
    reservationService.listAll(),
    eventService.listAll()
  ]);

  const eventLookup = Object.fromEntries(
    allEvents.map((e) => [e.id, { titleFr: e.title_fr, startsAt: new Date(e.starts_at) }])
  );

  const groups = groupReservationsByEvening(allReservations, eventLookup);
  const upcomingGroups = groups.filter((g) => g.upcoming);

  const totalPending = allReservations.filter((r) => r.status === "new").length;

  return (
    <main className="admin-shell">
      <div className="admin-page-bar">
        {totalPending > 0 ? (
          <p className="res-pending-badge">
            {totalPending} demande{totalPending > 1 ? "s" : ""} en attente
          </p>
        ) : (
          <p className="admin-page-subtitle">Aucune demande en attente.</p>
        )}
        <div className="admin-actions">
          <a className="button" href="/admin/reservations/new">
            + Nouvelle réservation
          </a>
        </div>
      </div>

      {upcomingGroups.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Aucune réservation pour une soirée à venir.
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

          {upcomingGroups.map((group) => (
            <a
              key={group.key}
              href={`/admin/reservations/groupe/${group.slug}`}
              className="res-group res-group-link is-upcoming"
            >
              <div className="res-group-heading">
                <span className="res-upcoming-dot" aria-hidden />
                <h2 className="res-group-label">{group.label}</h2>
                <span className="res-badge-upcoming">À venir</span>
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
