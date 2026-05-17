import { expect, test } from "@playwright/test";

test("submits privatization request successfully", async ({ page }) => {
  await page.goto("/privatisation");

  await page.getByLabel("Nom complet").fill("Entreprise Orion");
  await page.getByLabel("Email").fill("contact@orion.example");
  await page.getByLabel("Telephone").fill("0604050607");
  await page.getByLabel("Nombre de personnes").fill("120");
  await page.getByLabel("Date de l'evenement").fill("2099-11-20");
  await page.getByLabel("Budget indicatif").fill("10k - 20k EUR");
  await page.getByLabel("Message").fill("Privatisation complete souhaitee.");
  await page.getByLabel("J'accepte le traitement de mes donnees (RGPD)").check();

  await page.getByRole("button", { name: "Envoyer la demande" }).click();

  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByTestId("privatisation-success")).toBeVisible();
});

test("does not submit when RGPD consent is missing", async ({ page }) => {
  await page.goto("/privatisation");

  await page.getByLabel("Nom complet").fill("Entreprise Orion");
  await page.getByLabel("Email").fill("contact@orion.example");
  await page.getByLabel("Telephone").fill("0604050607");
  await page.getByLabel("Nombre de personnes").fill("120");

  await page.getByRole("button", { name: "Envoyer la demande" }).click();

  await expect(page).toHaveURL(/\/privatisation$/);
  await expect(page.getByTestId("privatisation-success")).toHaveCount(0);
});


test("rejects privatization spam when honeypot is filled", async ({ page }) => {
  await page.goto("/privatisation");

  await page.locator('input[name="website"]').fill("https://spam.example");
  await page.getByLabel("Nom complet").fill("Spam Company");
  await page.getByLabel("Email").fill("spam@example.com");
  await page.getByLabel("Telephone").fill("0604050607");
  await page.getByLabel("Nombre de personnes").fill("120");
  await page.getByLabel("J'accepte le traitement de mes donnees (RGPD)").check();

  await page.getByRole("button", { name: "Envoyer la demande" }).click();

  await expect(page).toHaveURL(/status=error/);
  await expect(page.getByTestId("privatisation-error")).toContainText("Trop de demandes");
});
