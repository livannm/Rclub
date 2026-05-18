import Link from "next/link";
import { EventCalendar } from "@/components/admin/event-calendar";
import { eventService } from "@/lib/events/events-service-instance";

type AdminEventsPageProps = {
  searchParams: Promise<{ message?: string; deleted?: string }>;
};

function formatEventDate(startsAt: string) {
  return new Date(startsAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const params = await searchParams;
  const events = await eventService.listAll();

  const calendarEvents = events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title_fr,
    startsAt: event.starts_at,
    isPublished: event.is_published
  }));

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="page-kicker">Admin</p>
          <h1>Événements</h1>
          <p>Calendrier et accès rapide — créez ou modifiez sans long scroll.</p>
        </div>
        <div className="admin-actions">
          <Link className="button" href="/admin/events/new">
            + Nouvel événement
          </Link>
          <Link className="button button-secondary" href="/admin">
            Dashboard
          </Link>
        </div>
      </header>

      {params.message ? <p className="status status-error">{params.message}</p> : null}
      {params.deleted === "1" ? (
        <p className="status status-success">Événement supprimé.</p>
      ) : null}

      <div className="admin-events-layout">
        <EventCalendar events={calendarEvents} />

        <aside className="admin-card admin-events-list">
          <h2>Liste ({events.length})</h2>
          {events.length === 0 ? <p>Aucun événement.</p> : null}
          <ul className="admin-event-rows">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="admin-event-row"
                  data-testid={`admin-event-row-${event.slug}`}
                >
                  <span className="admin-event-row-title">{event.title_fr}</span>
                  <span className="admin-event-row-meta">
                    {formatEventDate(event.starts_at)} · {event.slug}
                  </span>
                  <span
                    className={`admin-event-row-status${event.is_published ? " is-published" : ""}`}
                  >
                    {event.is_published ? "Publié" : "Brouillon"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
