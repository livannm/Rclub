import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./utils/admin";

test("site logo is visible on every page", async ({ page }) => {
  await page.goto("/");
  const logo = page.getByTestId("site-logo");
  await expect(logo).toBeVisible();
  const src = await logo.getAttribute("src");
  expect(src).toBeTruthy();
});

test("hero brand mark uses combined caligraphie logo on home", async ({
  page,
}) => {
  await page.goto("/");
  const wordmark = page.getByTestId("hero-wordmark");
  await expect(wordmark).toBeVisible();
  await expect(wordmark).toHaveAttribute(
    "src",
    "/media/caligraphie_logo.png",
  );
});

test("home upcoming events carousel is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("home-upcoming-events")).toBeVisible();
  await expect(page.getByTestId("home-next-event-heading")).toBeVisible();
});

test("admin can update logo URL and it reflects on the site", async ({
  page,
}) => {
  const newLogoUrl = "/media/custom-logo.png";

  await loginAsAdmin(page);

  await expect(page.getByTestId("current-logo-url")).toBeVisible();

  await page.getByLabel("Nouvelle URL du logo").fill(newLogoUrl);
  await page.getByRole("button", { name: "Mettre a jour le logo" }).click();

  await expect(page.getByTestId("current-logo-url")).toHaveText(newLogoUrl);

  await page.goto("/");
  await expect(page.getByTestId("site-logo")).toHaveAttribute(
    "src",
    newLogoUrl,
  );
});
