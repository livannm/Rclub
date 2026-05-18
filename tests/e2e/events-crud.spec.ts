import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./utils/admin";

test("admin can create update and delete an event", async ({ page }) => {
  const slug = `cash-out-${Date.now()}`;
  const createdTitle = `Cash Out ${Date.now()}`;
  const updatedTitle = `${createdTitle} Updated`;

  await loginAsAdmin(page);
  await page.goto("/admin/events/new");

  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Titre (FR)").fill(createdTitle);
  await page.getByLabel("Titre (EN)").fill("Cash Out");
  await page.getByLabel("Description (FR)").fill("Description FR");
  await page.getByLabel("Description (EN)").fill("Description EN");
  await page.getByLabel("Début").fill("2099-08-01T20:00");
  await page.getByLabel("Fin").fill("2099-08-02T02:00");
  await page.getByLabel("Lieu").fill("Rclub Strasbourg");
  await page.getByLabel("Image de couverture").fill("https://example.com/cover.jpg");
  await page.getByLabel("Publier sur l'agenda").check();
  await page.getByRole("button", { name: "Ajouter l'événement" }).click();

  await expect(page).toHaveURL(new RegExp(`/admin/events/.+/edit`));
  await expect(page.getByRole("heading", { name: createdTitle })).toBeVisible();

  await page.getByLabel("Titre (FR)").fill(updatedTitle);
  await page.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();

  await page.getByRole("button", { name: "Supprimer l'événement" }).click();
  await expect(page).toHaveURL(/\/admin\/events/);
  await expect(page.getByTestId(`admin-event-row-${slug}`)).toHaveCount(0);
});
