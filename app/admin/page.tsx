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
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="page-kicker">Admin</p>
          <h1>Tableau de bord admin</h1>
          <p>Connecte en tant que: {session?.user?.email ?? "admin"}</p>
        </div>
        <div className="admin-actions">
          <a className="button button-secondary" href="/admin/events">Gerer les evenements</a>
        </div>
      </header>

      <section
        aria-labelledby="stats-heading"
        className="admin-card"
      >
        <h2 id="stats-heading">Statistiques rapides</h2>
        <div className="stats-grid">
          <article className="section-panel">
            <h3>Evenements</h3>
            <p data-testid="admin-stat-events-total">Total: {stats.events.total}</p>
            <p data-testid="admin-stat-events-published">Publies: {stats.events.published}</p>
            <p data-testid="admin-stat-events-upcoming">
              A venir publies: {stats.events.upcomingPublished}
            </p>
          </article>
          <article className="section-panel">
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
          <article className="section-panel">
            <h3>Galerie</h3>
            <p data-testid="admin-stat-gallery-photos">Photos: {stats.gallery.photosTotal}</p>
            <p data-testid="admin-stat-gallery-events">
              Evenements avec photos: {stats.gallery.eventsWithPhotos}
            </p>
          </article>
        </div>
      </section>

      <section className="admin-card admin-section">
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
            className="site-logo"
          />
        )}
        <form
          action={updateLogoAction}
          className="admin-form"
        >
          <label htmlFor="logo_url">
            Nouvelle URL du logo
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              placeholder="https://... ou /media/logo.svg"
              defaultValue={currentLogo}
              required
            />
          </label>
          <button type="submit">
            Mettre a jour le logo
          </button>
        </form>
      </section>

      <section className="admin-card admin-section">
        <h2>Video Hero</h2>
        <p>
          URL actuelle:{" "}
          <code data-testid="current-hero-video-url">{currentHeroVideo}</code>
        </p>
        <form
          action={updateHeroVideoAction}
          className="admin-form"
        >
          <label htmlFor="hero_video_url">
            Nouvelle URL de la video hero
            <input
              id="hero_video_url"
              name="hero_video_url"
              type="url"
              placeholder="https://... ou /media/hero.mp4"
              defaultValue={currentHeroVideo}
              required
            />
          </label>
          <button type="submit">
            Mettre a jour la video
          </button>
        </form>
      </section>
    </main>
  );
}
