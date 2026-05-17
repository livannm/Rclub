import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { adminDashboardStatsService } from "@/lib/admin-stats/admin-dashboard-stats-instance";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";

export default async function AdminDashboardPage() {
  const session = await auth();
  const currentHeroVideo = await siteAssetService.getHeroVideo();
  const currentLogo = await siteAssetService.getLogo();
  const stats = await adminDashboardStatsService.getStats();

  async function updateHeroVideoAction(formData: FormData) {
    "use server";
    const url = formData.get("hero_video_url");
    if (typeof url !== "string" || !url.trim()) {
      return;
    }
    await siteAssetService.updateHeroVideo(url.trim());
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function updateLogoAction(formData: FormData) {
    "use server";
    const url = formData.get("logo_url");
    if (typeof url !== "string" || !url.trim()) {
      return;
    }
    await siteAssetService.updateLogo(url.trim());
    revalidatePath("/");
    revalidatePath("/admin");
  }

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <h1>Tableau de bord admin</h1>
      <p>Connecte en tant que: {session?.user?.email ?? "admin"}</p>
      <p>
        <a href="/admin/events">Gerer les evenements</a>
      </p>

      <section
        aria-labelledby="stats-heading"
        style={{ border: "1px solid #333", padding: "1rem" }}
      >
        <h2 id="stats-heading">Statistiques rapides</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            gap: "0.75rem"
          }}
        >
          <article style={{ border: "1px solid #555", padding: "0.75rem" }}>
            <h3>Evenements</h3>
            <p data-testid="admin-stat-events-total">Total: {stats.events.total}</p>
            <p data-testid="admin-stat-events-published">Publies: {stats.events.published}</p>
            <p data-testid="admin-stat-events-upcoming">
              A venir publies: {stats.events.upcomingPublished}
            </p>
          </article>
          <article style={{ border: "1px solid #555", padding: "0.75rem" }}>
            <h3>Demandes</h3>
            <p data-testid="admin-stat-reservations">
              Reservations: {stats.requests.reservationsTotal}
            </p>
            <p data-testid="admin-stat-reservations-new">
              Nouvelles reservations: {stats.requests.reservationsNew}
            </p>
            <p data-testid="admin-stat-privatizations">
              Privatisations: {stats.requests.privatizationsTotal}
            </p>
            <p data-testid="admin-stat-privatizations-new">
              Nouvelles privatisations: {stats.requests.privatizationsNew}
            </p>
          </article>
          <article style={{ border: "1px solid #555", padding: "0.75rem" }}>
            <h3>Galerie</h3>
            <p data-testid="admin-stat-gallery-photos">Photos: {stats.gallery.photosTotal}</p>
            <p data-testid="admin-stat-gallery-events">
              Evenements avec photos: {stats.gallery.eventsWithPhotos}
            </p>
          </article>
        </div>
      </section>

      <section style={{ border: "1px solid #333", padding: "1rem" }}>
        <h2>Logo du site</h2>
        <p>
          URL actuelle:{" "}
          <code data-testid="current-logo-url">{currentLogo}</code>
        </p>
        {currentLogo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentLogo}
            alt="Logo actuel"
            data-testid="current-logo-preview"
            style={{ maxHeight: "60px", marginTop: "0.5rem" }}
          />
        )}
        <form
          action={updateLogoAction}
          style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}
        >
          <label htmlFor="logo_url">Nouvelle URL du logo</label>
          <input
            id="logo_url"
            name="logo_url"
            type="url"
            placeholder="https://... ou /media/logo.svg"
            defaultValue={currentLogo}
            required
            style={{ padding: "0.25rem" }}
          />
          <button type="submit" style={{ width: "fit-content" }}>
            Mettre a jour le logo
          </button>
        </form>
      </section>

      <section style={{ border: "1px solid #333", padding: "1rem" }}>
        <h2>Video Hero</h2>
        <p>
          URL actuelle:{" "}
          <code data-testid="current-hero-video-url">{currentHeroVideo}</code>
        </p>
        <form
          action={updateHeroVideoAction}
          style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}
        >
          <label htmlFor="hero_video_url">Nouvelle URL de la video hero</label>
          <input
            id="hero_video_url"
            name="hero_video_url"
            type="url"
            placeholder="https://... ou /media/hero.mp4"
            defaultValue={currentHeroVideo}
            required
            style={{ padding: "0.25rem" }}
          />
          <button type="submit" style={{ width: "fit-content" }}>
            Mettre a jour la video
          </button>
        </form>
      </section>
    </main>
  );
}
