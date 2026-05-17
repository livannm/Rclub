import { expect, test } from "@playwright/test";
import { createEvent, loginAsAdmin } from "./utils/admin";

test("home highlight section is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Prochain evenement" })).toBeVisible();
});

test("home highlight shows nearest upcoming event", async ({ page }) => {
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
  await createEvent(page, {
    slug: `late-${suffix}`,
    title: lateTitle,
    startsAt: "2026-05-22T20:00",
    endsAt: "2026-05-22T23:00"
  });

  await page.goto("/");
  await expect(page.getByTestId("home-next-event-title")).toContainText("Evenement proche");
});
