import Link from "next/link";
import { EventCalendar } from "@/components/admin/event-calendar";
import { eventService } from "@/lib/events/events-service-instance";
import { formatEventDateTime } from "@/lib/utils/format-date";

type AdminEventsPageProps = {
  searchParams: Promise<{ message?: string; deleted?: string }>;
};

function formatEventDate(startsAt: string) {
  return formatEventDateTime(startsAt, "fr");
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
      <div className="admin-page-bar">
        <p className="admin-page-subtitle">
          Calendrier et accès rapide — {events.length} événement{events.length > 1 ? "s" : ""} au total.
        </p>
        <div className="admin-actions">
          <Link className="button" href="/admin/events/new">
            + Nouvel événement
          </Link>
        </div>
      </div>

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
