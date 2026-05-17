import { expect, test } from "@playwright/test";

test("submits reservation request successfully", async ({ page }) => {
  await page.goto("/reservations");

  await page.getByLabel("Nom complet").fill("Alice Martin");
  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Telephone").fill("0601020304");
  await page.getByLabel("Nombre de personnes").fill("5");
  await page.getByLabel("Date souhaitee").fill("2099-08-02");
  await page.getByLabel("Message").fill("Merci de me confirmer la disponibilite.");
  await page
    .getByLabel("J'accepte le traitement de mes donnees (RGPD)")
    .check();

  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByTestId("reservation-success")).toBeVisible();
});

test("shows validation error when consent is missing", async ({ page }) => {
  await page.goto("/reservations");

  await page.getByLabel("Nom complet").fill("Alice Martin");
  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Telephone").fill("0601020304");
  await page.getByLabel("Nombre de personnes").fill("5");
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/\/reservations$/);
  await expect(page.getByTestId("reservation-success")).toHaveCount(0);
});


test("rejects reservation spam when honeypot is filled", async ({ page }) => {
  await page.goto("/reservations");

  await page.locator('input[name="website"]').fill("https://spam.example");
  await page.getByLabel("Nom complet").fill("Spam Bot");
  await page.getByLabel("Email").fill("spam@example.com");
  await page.getByLabel("Telephone").fill("0601020304");
  await page.getByLabel("Nombre de personnes").fill("5");
  await page.getByLabel("J'accepte le traitement de mes donnees (RGPD)").check();

  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/status=error/);
  await expect(page.getByTestId("reservation-error")).toContainText("Trop de demandes");
});
