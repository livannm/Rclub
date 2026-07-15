import { expect, test } from "@playwright/test";

async function fillReservationBasics(page: import("@playwright/test").Page) {
  await page.getByLabel("Prénom").fill("Alice");
  await page.getByLabel("Nom", { exact: true }).fill("Martin");
  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Téléphone").fill("0601020304");
  await page.getByLabel("Nombre de personnes").fill("5");
  await page.getByLabel("Date souhaitée").fill("2099-08-02");
  await page.getByLabel("Heure d'arrivée").selectOption("23:00");
  await page.getByLabel("Classique", { exact: true }).check();
}

test("submits reservation request successfully", async ({ page }) => {
  await page.goto("/reservations");

  await fillReservationBasics(page);
  await page.getByLabel("Message").fill("Merci de me confirmer la disponibilité.");
  await page
    .getByLabel("J'accepte le traitement de mes données (RGPD)")
    .check();

  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByTestId("reservation-success")).toBeVisible();
});

test("shows validation error when consent is missing", async ({ page }) => {
  await page.goto("/reservations");

  await fillReservationBasics(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/\/reservations$/);
  await expect(page.getByTestId("reservation-success")).toHaveCount(0);
});

test("rejects reservation spam when honeypot is filled", async ({ page }) => {
  await page.goto("/reservations");

  await page.locator('input[name="website"]').fill("https://spam.example");
  await page.getByLabel("Prénom").fill("Spam");
  await page.getByLabel("Nom", { exact: true }).fill("Bot");
  await page.getByLabel("Email").fill("spam@example.com");
  await page.getByLabel("Téléphone").fill("0601020304");
  await page.getByLabel("Nombre de personnes").fill("5");
  await page.getByLabel("Date souhaitée").fill("2099-08-02");
  await page.getByLabel("Heure d'arrivée").selectOption("23:00");
  await page.getByLabel("VIP", { exact: true }).check();
  await page.getByLabel("J'accepte le traitement de mes données (RGPD)").check();

  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  await expect(page).toHaveURL(/status=error/);
  await expect(page.getByTestId("reservation-error")).toContainText("Trop de demandes");
});
