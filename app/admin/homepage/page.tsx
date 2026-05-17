import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HomepageContentServiceError } from "@/lib/homepage/homepage-content-service";
import { homepageContentService } from "@/lib/homepage/homepage-content-service-instance";

type AdminHomepagePageProps = {
  searchParams: Promise<{ message?: string }>;
};

function textFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export default async function AdminHomepagePage({ searchParams }: AdminHomepagePageProps) {
  const params = await searchParams;
  const content = await homepageContentService.get();

  async function updateHomepageAction(formData: FormData) {
    "use server";

    try {
      await homepageContentService.update({
        title_fr: textFromFormData(formData, "title_fr"),
        title_en: textFromFormData(formData, "title_en"),
        description_fr: textFromFormData(formData, "description_fr"),
        description_en: textFromFormData(formData, "description_en")
      });

      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/homepage");
      redirect("/admin/homepage?message=Texte%20d%27accueil%20enregistre.");
    } catch (error) {
      if (error instanceof HomepageContentServiceError) {
        redirect(`/admin/homepage?message=${encodeURIComponent(error.message)}`);
      }
      throw error;
    }
  }

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>Administration - Texte d&apos;accueil</h1>
      <p>Modifie les contenus editoriaux visibles sur la page d&apos;accueil (FR/EN).</p>
      {params.message ? <p style={{ color: "#16a34a" }}>{params.message}</p> : null}

      <form action={updateHomepageAction} style={{ display: "grid", gap: "0.5rem", maxWidth: "40rem" }}>
        <label htmlFor="title_fr">Titre accueil (FR)</label>
        <input id="title_fr" name="title_fr" defaultValue={content.title_fr} required />

        <label htmlFor="description_fr">Description accueil (FR)</label>
        <textarea id="description_fr" name="description_fr" defaultValue={content.description_fr} required />

        <label htmlFor="title_en">Title home (EN)</label>
        <input id="title_en" name="title_en" defaultValue={content.title_en} required />

        <label htmlFor="description_en">Home description (EN)</label>
        <textarea id="description_en" name="description_en" defaultValue={content.description_en} required />

        <button type="submit">Enregistrer le texte d&apos;accueil</button>
      </form>
    </main>
  );
}
