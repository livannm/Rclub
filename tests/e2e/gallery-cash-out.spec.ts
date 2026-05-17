import { expect, test } from "@playwright/test";

test("navigates to Cash Out gallery and displays photos", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Voir la galerie Cash Out" }).click();

  await expect(page).toHaveURL(/\/gallery\/cash-out$/);
  await expect(page.getByRole("heading", { name: "Galerie Cash Out" })).toBeVisible();
  await expect(page.getByTestId("gallery-photo-0")).toBeVisible();
});
