import { eventService } from "@/lib/events/events-service-instance";

export default async function AgendaPage() {
  const events = await eventService.listPublishedUpcoming();

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>Agenda des evenements</h1>
      {events.length === 0 ? <p data-testid="agenda-empty">Aucun evenement a venir.</p> : null}

      {events.map((event, index) => (
        <article key={event.id} style={{ border: "1px solid #333", padding: "1rem" }}>
          <h2 data-testid={`agenda-event-title-${index}`}>{event.title_fr}</h2>
          <p>{event.description_fr}</p>
          <p>Debut: {new Date(event.starts_at).toLocaleString("fr-FR")}</p>
          <p>Lieu: {event.location}</p>
          {event.ticket_url ? (
            <p>
              <a href={event.ticket_url}>Billetterie</a>
            </p>
          ) : null}
        </article>
      ))}
    </main>
  );
}
