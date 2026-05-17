import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";

export default async function AdminDashboardPage() {
  const session = await auth();
  const currentHeroVideo = await siteAssetService.getHeroVideo();

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

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <h1>Tableau de bord admin</h1>
      <p>Connecte en tant que: {session?.user?.email ?? "admin"}</p>
      <p>
        <a href="/admin/events">Gerer les evenements</a>
      </p>

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
