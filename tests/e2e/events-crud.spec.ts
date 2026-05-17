import { expect, test, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@rclub.fr");
  await page.getByLabel("Mot de passe").fill("secret1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("admin can create update and delete an event", async ({ page }) => {
  const slug = `cash-out-${Date.now()}`;
  const createdTitle = `Cash Out ${Date.now()}`;
  const updatedTitle = `${createdTitle} Updated`;

  await loginAsAdmin(page);
  await page.goto("/admin/events");

  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Titre (FR)").fill(createdTitle);
  await page.getByLabel("Titre (EN)").fill("Cash Out");
  await page.getByLabel("Description (FR)").fill("Description FR");
  await page.getByLabel("Description (EN)").fill("Description EN");
  await page.getByLabel("Debut").fill("2099-08-01T20:00");
  await page.getByLabel("Fin").fill("2099-08-02T02:00");
  await page.getByLabel("Lieu").fill("Rclub Strasbourg");
  await page.getByLabel("Cover image URL").fill("https://example.com/cover.jpg");
  await page.getByLabel("Hero video URL").fill("https://example.com/hero.mp4");
  await page.getByLabel("Ticket URL").fill("https://example.com/tickets");
  await page.getByLabel("Publier").check();
  await page.getByRole("button", { name: "Ajouter l'evenement" }).click();

  const eventCard = page.locator("article").filter({ hasText: slug });
  await expect(eventCard).toBeVisible();
  await expect(eventCard.getByText(createdTitle)).toBeVisible();

  await eventCard.getByLabel(`Titre FR ${slug}`).fill(updatedTitle);
  await eventCard.getByRole("button", { name: "Modifier" }).click();

  await expect(page.locator("article").filter({ hasText: updatedTitle })).toBeVisible();

  const updatedCard = page.locator("article").filter({ hasText: slug });
  await updatedCard.getByRole("button", { name: "Supprimer" }).click();
  await expect(page.locator("article").filter({ hasText: slug })).toHaveCount(0);
});
