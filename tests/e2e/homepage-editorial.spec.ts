import { expect, test, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@rclub.fr");
  await page.getByLabel("Mot de passe").fill("secret1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("admin edits homepage text and visitors see updates", async ({ page }) => {
  const suffix = Date.now();
  const frTitle = `Bienvenue ${suffix}`;
  const frDescription = `Texte FR ${suffix}`;
  const enTitle = `Welcome ${suffix}`;
  const enDescription = `EN text ${suffix}`;

  await loginAsAdmin(page);
  await page.goto("/admin/homepage");

  await page.getByLabel("Titre accueil (FR)").fill(frTitle);
  await page.getByLabel("Description accueil (FR)").fill(frDescription);
  await page.getByLabel("Title home (EN)").fill(enTitle);
  await page.getByLabel("Home description (EN)").fill(enDescription);
  await page.getByRole("button", { name: "Enregistrer le texte d'accueil" }).click();

  await expect(page.getByText("Texte d'accueil enregistre.")).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(frTitle);
  await expect(page.getByText(frDescription)).toBeVisible();

  await page.getByTestId("locale-switch-en").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(enTitle);
  await expect(page.getByText(enDescription)).toBeVisible();
});
