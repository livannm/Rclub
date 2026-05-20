import { expect, test } from "@playwright/test";

/** Ordre attendu des deux premiers evenements (lib/seed/demo-content). */
const FIRST_UPCOMING_TITLE_FR = "Vendredi 8 Mai";
const SECOND_UPCOMING_TITLE_FR = "Take Me Back";

test("home highlights nearest event and agenda is sorted", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("home-next-event-title")).toHaveText(
    FIRST_UPCOMING_TITLE_FR,
  );

  await page.goto("/agenda");
  await expect(page.getByTestId("agenda-event-title-0")).toHaveText(
    FIRST_UPCOMING_TITLE_FR,
  );
  await expect(page.getByTestId("agenda-event-title-1")).toHaveText(
    SECOND_UPCOMING_TITLE_FR,
  );
});
