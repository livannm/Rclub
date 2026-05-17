import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";

export default async function AdminDashboardPage() {
  const session = await auth();
  const currentHeroVideo = await siteAssetService.getHeroVideo();
  const currentLogo = await siteAssetService.getLogo();

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
