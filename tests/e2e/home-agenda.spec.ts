import { expect, test } from "@playwright/test";
import { createEvent, loginAsAdmin } from "./utils/admin";

test("home highlights nearest event and agenda is sorted", async ({ page }) => {
  const suffix = Date.now();
  const earlyTitle = `Evenement proche ${suffix}`;
  const lateTitle = `Evenement tardif ${suffix}`;

  await loginAsAdmin(page);
  await createEvent(page, {
    slug: `early-${suffix}`,
    title: earlyTitle,
    startsAt: "2026-05-20T20:00",
    endsAt: "2026-05-20T23:00"
  });
  await expect(page.locator("article").filter({ hasText: `early-${suffix}` })).toBeVisible();

  await createEvent(page, {
    slug: `late-${suffix}`,
    title: lateTitle,
    startsAt: "2026-05-22T20:00",
    endsAt: "2026-05-22T23:00"
  });
  await expect(page.locator("article").filter({ hasText: `late-${suffix}` })).toBeVisible();

  await page.goto("/");
  await expect(page.getByTestId("home-next-event-title")).toHaveText(earlyTitle);

  await page.goto("/agenda");
  await expect(page.getByTestId("agenda-event-title-0")).toHaveText(earlyTitle);
  await expect(page.getByTestId("agenda-event-title-1")).toHaveText(lateTitle);
});
