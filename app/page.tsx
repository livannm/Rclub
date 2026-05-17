import { eventService } from "@/lib/events/events-service-instance";

export default async function HomePage() {
  const upcomingEvents = await eventService.listPublishedUpcoming();
  const nextEvent = upcomingEvents[0] ?? null;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Rclub</h1>
      <p>Socle MVP en cours: auth admin et CRUD evenements disponibles.</p>

      <section style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem" }}>
        <h2>Prochain evenement</h2>
        {nextEvent ? (
          <div>
            <p data-testid="home-next-event-title">{nextEvent.title_fr}</p>
            <p>Debut: {new Date(nextEvent.starts_at).toLocaleString("fr-FR")}</p>
          </div>
        ) : (
          <p data-testid="home-next-event-empty">Programmation a venir.</p>
        )}
      </section>

      <p>
        <a href="/admin">Acceder a l&apos;espace admin</a>
      </p>
      <p>
        <a href="/agenda">Voir l&apos;agenda</a>
      </p>
      <p>
        <a href="/reservations">Faire une demande de reservation</a>
      </p>
    </main>
  );
}
