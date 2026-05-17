import { expect, test } from "@playwright/test";

test("navigates to gallery index from home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Voir la galerie" }).click();

  await expect(page).toHaveURL(/\/galerie$/);
  await expect(page.getByRole("heading", { name: "Galerie" })).toBeVisible();
});

test("gallery index lists events with photos", async ({ page }) => {
  await page.goto("/galerie");

  await expect(page.getByTestId("gallery-index-item-0")).toBeVisible();
});

test("navigates from gallery index to event gallery", async ({ page }) => {
  await page.goto("/galerie");
  await page.getByTestId("gallery-index-item-0").click();

  await expect(page).toHaveURL(/\/galerie\/.+$/);
  await expect(page.getByTestId("gallery-photo-0")).toBeVisible();
});

test("direct access to event gallery displays photos", async ({ page }) => {
  await page.goto("/galerie/cash-out");

  await expect(page.getByTestId("gallery-photo-0")).toBeVisible();
});
