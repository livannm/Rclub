import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./utils/admin";

test("site logo navigates home on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/agenda");
  await page.getByTestId("site-logo").click();
  await expect(page).toHaveURL("/");
});

test("hero wordmark navigates home", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByTestId("hero-wordmark").click();
  await expect(page).toHaveURL("/");
});

test("mobile nav drawer opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/agenda");

  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.locator("#site-nav-drawer.is-open")).toBeVisible();

  await page.locator(".site-nav-overlay").click();
  await expect(page.locator("#site-nav-drawer.is-open")).toHaveCount(0);

  await page.getByTestId("site-logo").click();
  await expect(page).toHaveURL("/");
});

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
