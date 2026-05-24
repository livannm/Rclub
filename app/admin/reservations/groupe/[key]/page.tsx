import { notFound } from "next/navigation";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { eventService } from "@/lib/events/events-service-instance";
import { groupReservationsByEvening } from "@/lib/reservations/reservation-groups";
import type { ReservationRequest } from "@/lib/reservations/reservation-schema";

type GroupePageProps = {
  params: Promise<{ key: string }>;
};

function statusLabel(status: string): string {
  switch (status) {
    case "new": return "Nouveau";
    case "reviewed": return "Examiné";
    case "contacted": return "Contacté";
    case "confirmed": return "Confirmé";
    case "refused": return "Refusé";
    case "closed": return "Clôturé";
    default: return status;
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function AdminReservationsGroupePage({ params }: GroupePageProps) {
  const { key } = await params;

  const [allReservations, allEvents] = await Promise.all([
    reservationService.listAll(),
    eventService.listAll()
  ]);

  const eventLookup = Object.fromEntries(
    allEvents.map((e) => [e.id, { titleFr: e.title_fr, startsAt: new Date(e.starts_at) }])
  );

  const groups = groupReservationsByEvening(allReservations, eventLookup);
  const group = groups.find((g) => g.slug === key);

  if (!group) notFound();

  const backHref = group.upcoming
    ? "/admin/reservations"
    : "/admin/reservations/historique";

  const sorted = [...group.reservations].sort((a: ReservationRequest, b: ReservationRequest) => {
    const order = ["new", "reviewed", "contacted", "confirmed", "refused", "closed"];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="page-kicker">Réservations</p>
          <h1>{group.label}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {group.confirmed} confirmée{group.confirmed > 1 ? "s" : ""} ·{" "}
            {group.pending} en attente ·{" "}
            {group.refused} refusée{group.refused > 1 ? "s" : ""} ·{" "}
            {group.totalGuestsConfirmed} guest{group.totalGuestsConfirmed > 1 ? "s" : ""} confirmé{group.totalGuestsConfirmed > 1 ? "s" : ""}
          </p>
        </div>
        <div className="admin-actions">
          {group.eventId && (
            <a className="button button-ghost" href={`/admin/events/${group.eventId}/edit`}>
              Voir l&apos;événement
            </a>
          )}
          <a className="button button-secondary" href={backHref}>
            ← Retour
          </a>
          <a className="button" href="/admin/reservations/new">
            + Nouvelle réservation
          </a>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Aucune réservation.</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="res-groupe-header">
            <span>Nom</span>
            <span>Date</span>
            <span>Personnes</span>
            <span>Statut</span>
          </div>
          <ul className="res-list res-list-full">
            {sorted.map((r) => (
              <li key={r.id}>
                <a href={`/admin/reservations/${r.id}`} className="res-row res-row-full">
                  <span className="res-row-name">{r.full_name}</span>
                  <span className="res-row-date">{formatDate(r.date_requested)}</span>
                  <span className="res-row-guests">{r.guest_count} pers.</span>
                  <span className={`res-row-status res-status-${r.status}`}>
                    {statusLabel(r.status)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
