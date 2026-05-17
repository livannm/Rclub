import { expect, test } from "@playwright/test";

test("switches from french to english while keeping current page", async ({ page }) => {
  await page.goto("/agenda");
  await expect(page.getByRole("heading", { name: "Agenda des evenements" })).toBeVisible();

  await page.getByTestId("locale-switch-en").click();

  await expect(page).toHaveURL(/\/agenda$/);
  await expect(page.getByRole("heading", { name: "Events schedule" })).toBeVisible();
});

test("shows english text on homepage after locale switch", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("locale-switch-en").click();

  await expect(
    page.getByText(
      "Premium nightlife in Strasbourg: signature nights, photo gallery, VIP reservations and bespoke private events."
    )
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "See the events schedule" })).toBeVisible();
});
