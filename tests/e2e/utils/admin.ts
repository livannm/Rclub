import { expect, type Page } from "@playwright/test";

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/admin/login");
  await page.getByLabel("Identifiant").fill("adminRclub");
  await page.getByLabel("Mot de passe").fill("strasbourgRClub");
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
  await page.goto("/admin/events/new");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Titre (FR)").fill(title);
  await page.getByLabel("Titre (EN)").fill(title);
  await page.getByLabel("Description (FR)").click();
  await page.getByLabel("Description (FR)").fill(descriptionFr);
  await page.getByLabel("Description (EN)").click();
  await page.getByLabel("Description (EN)").fill(descriptionEn);
  await page.getByLabel("Début").fill(startsAt);
  await page.getByLabel("Fin").fill(endsAt);
  await page.getByLabel("Lieu").fill(location);
  await page.getByLabel("Image de couverture").fill(coverImageUrl);
  await page.getByLabel("Vidéo hero (optionnel)").fill(heroVideoUrl);
  await page.getByLabel("Billetterie (optionnel)").fill(ticketUrl);
  await page.getByLabel("Publier sur l'agenda").check();
  await page.getByRole("button", { name: "Ajouter l'événement" }).click();
}
