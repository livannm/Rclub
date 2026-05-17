import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./utils/admin";

test("homepage displays hero video element", async ({ page }) => {
  await page.goto("/");
  const video = page.getByTestId("hero-video");
  await expect(video).toBeVisible();
  const src = await video.getAttribute("src");
  expect(src).toBeTruthy();
});

test("admin can update hero video URL and it reflects on homepage", async ({ page }) => {
  const newVideoUrl = "/media/custom-hero.mp4";

  await loginAsAdmin(page);

  const currentUrlCode = page.getByTestId("current-hero-video-url");
  await expect(currentUrlCode).toBeVisible();

  await page.getByLabel("Nouvelle URL de la video hero").fill(newVideoUrl);
  await page.getByRole("button", { name: "Mettre a jour la video" }).click();

  await expect(page.getByTestId("current-hero-video-url")).toHaveText(newVideoUrl);

  await page.goto("/");
  const video = page.getByTestId("hero-video");
  await expect(video).toHaveAttribute("src", newVideoUrl);
});
