import { expect, test } from "@playwright/test";

/** Premier evenement publie a venir dans lib/seed/demo-content (ven-8-mai). */
const FIRST_UPCOMING_TITLE_FR = "Vendredi 8 Mai";

test("home highlight section is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("home-next-event-heading")).toBeVisible();
});

test("home highlight shows nearest upcoming event from existing data", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("home-next-event-title")).toContainText(
    FIRST_UPCOMING_TITLE_FR,
  );
});
