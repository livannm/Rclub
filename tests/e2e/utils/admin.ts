import { expect, type Page } from "@playwright/test";

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@rclub.fr");
  await page.getByLabel("Mot de passe").fill("secret1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

export type CreateEventInput = {
  slug: string;
  title: string;
  startsAt: string;
  endsAt: string;
  descriptionFr?: string;
  descriptionEn?: string;
  location?: string;
  coverImageUrl?: string;
  heroVideoUrl?: string;
  ticketUrl?: string;
};

export async function createEvent(
  page: Page,
  {
    slug,
    title,
    startsAt,
    endsAt,
    descriptionFr = "Description FR",
    descriptionEn = "Description EN",
    location = "Rclub Strasbourg",
    coverImageUrl = "https://example.com/cover.jpg",
    heroVideoUrl = "https://example.com/hero.mp4",
    ticketUrl = "https://example.com/tickets"
  }: CreateEventInput
): Promise<void> {
  await page.goto("/admin/events");
  const createSection = page.locator("section").filter({ hasText: "Creer un evenement" });
  await createSection.getByLabel("Slug").fill(slug);
  await createSection.getByLabel("Titre (FR)").fill(title);
  await createSection.getByLabel("Titre (EN)").fill(title);
  await createSection.getByLabel("Description (FR)").fill(descriptionFr);
  await createSection.getByLabel("Description (EN)").fill(descriptionEn);
  await createSection.getByLabel("Debut").fill(startsAt);
  await createSection.getByLabel("Fin").fill(endsAt);
  await createSection.getByLabel("Lieu").fill(location);
  await createSection.getByLabel("Cover image URL").fill(coverImageUrl);
  await createSection.getByLabel("Hero video URL").fill(heroVideoUrl);
  await createSection.getByLabel("Ticket URL").fill(ticketUrl);
  await createSection.getByLabel("Publier").check();
  await createSection.getByRole("button", { name: "Ajouter l'evenement" }).click();
}
