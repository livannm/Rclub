import { expect, test } from "@playwright/test";

test("redirects anonymous users from /admin to /admin/login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Connexion admin" })).toBeVisible();
});

test("allows admin login and access to dashboard", async ({ page }) => {
  await page.goto("/admin");

  await page.getByLabel("Identifiant").fill("adminRclub");
  await page.getByLabel("Mot de passe").fill("strasbourgRClub");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Tableau de bord admin" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Statistiques rapides" })).toBeVisible();
});

test("shows an error for invalid login", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("Identifiant").fill("adminRclub");
  await page.getByLabel("Mot de passe").fill("bad-password");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL(/error=CredentialsSignin/);
  await expect(page.getByText("Identifiants invalides.")).toBeVisible();
});
