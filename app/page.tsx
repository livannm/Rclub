export default function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Rclub</h1>
      <p>Socle MVP en cours: auth admin et gestion des evenements.</p>

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
