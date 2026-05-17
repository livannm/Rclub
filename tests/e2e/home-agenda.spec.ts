import { expect, test, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@rclub.fr");
  await page.getByLabel("Mot de passe").fill("secret1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function createEvent(
  page: Page,
  slug: string,
  title: string,
  startsAt: string,
  endsAt: string
) {
  await page.goto("/admin/events");
  const createSection = page.locator("section").filter({ hasText: "Creer un evenement" });
  await createSection.getByLabel("Slug").fill(slug);
  await createSection.getByLabel("Titre (FR)").fill(title);
  await createSection.getByLabel("Titre (EN)").fill(title);
  await createSection.getByLabel("Description (FR)").fill("Description FR");
  await createSection.getByLabel("Description (EN)").fill("Description EN");
  await createSection.getByLabel("Debut").fill(startsAt);
  await createSection.getByLabel("Fin").fill(endsAt);
  await createSection.getByLabel("Lieu").fill("Rclub Strasbourg");
  await createSection.getByLabel("Cover image URL").fill("https://example.com/cover.jpg");
  await createSection.getByLabel("Hero video URL").fill("https://example.com/hero.mp4");
  await createSection.getByLabel("Ticket URL").fill("https://example.com/tickets");
  await createSection.getByLabel("Publier").check();
  await createSection.getByRole("button", { name: "Ajouter l'evenement" }).click();
  await expect(page.locator("article").filter({ hasText: slug })).toBeVisible();
}

test("home highlights nearest event and agenda is sorted", async ({ page }) => {
  const suffix = Date.now();
  const earlyTitle = `Evenement proche ${suffix}`;
  const lateTitle = `Evenement tardif ${suffix}`;

  await loginAsAdmin(page);
  await createEvent(page, `early-${suffix}`, earlyTitle, "2026-05-20T20:00", "2026-05-20T23:00");
  await createEvent(page, `late-${suffix}`, lateTitle, "2026-05-22T20:00", "2026-05-22T23:00");

  await page.goto("/");
  await expect(page.getByTestId("home-next-event-title")).toHaveText(earlyTitle);

  await page.goto("/agenda");
  await expect(page.getByTestId("agenda-event-title-0")).toHaveText(earlyTitle);
  await expect(page.getByTestId("agenda-event-title-1")).toHaveText(lateTitle);
});
