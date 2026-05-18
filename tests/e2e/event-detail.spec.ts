import { expect, test } from "@playwright/test";

test("agenda event card links to detail page", async ({ page }) => {
  await page.goto("/agenda");

  const firstCard = page.locator(".event-card-interactive").first();
  await expect(firstCard).toBeVisible();

  const title = await firstCard.locator("h2").innerText();
  await firstCard.locator("a.event-card-hit-area").click();

  await expect(page).toHaveURL(/\/agenda\/.+$/);
  await expect(page.getByTestId("event-detail-title")).toHaveText(title);
  await expect(page.getByRole("link", { name: /Retour à l'agenda|Back to schedule/ })).toBeVisible();
});
