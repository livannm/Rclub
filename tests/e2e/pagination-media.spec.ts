import { expect, test } from "@playwright/test";
import { DEMO_EVENT_IDS } from "../../lib/seed/demo-content";

test.describe("public pagination and media feedback", () => {
  test.beforeAll(async ({ browser }) => {
    // Seed through the existing authenticated API; no test-only production routes.
    const context = await browser.newContext();
    const { csrfToken } = await (await context.request.get("/api/auth/csrf")).json();
    await context.request.post("/api/auth/callback/credentials", {
      form: { csrfToken, email: process.env.ADMIN_EMAIL ?? "admin@rclub.fr", password: process.env.ADMIN_PASSWORD ?? "secret1234" },
    });
    const session = await (await context.request.get("/api/auth/session")).json();
    expect(session.user).toBeTruthy();
    for (const id of [DEMO_EVENT_IDS.takeMeBack, DEMO_EVENT_IDS.ven8Mai, DEMO_EVENT_IDS.adultsOnly, DEMO_EVENT_IDS.rFamily, DEMO_EVENT_IDS.jun05Thu]) {
      const response = await context.request.post(`/api/admin/events/${id}/photos`, {
        data: { image_url: "/media/events/legend-r.png", alt_fr: "Photo de soirée", alt_en: "Party photo", order: 1 },
      });
      expect(response.status()).toBe(201);
    }
    const existing = await (await context.request.get(`/api/admin/events/${DEMO_EVENT_IDS.legendR}/photos`)).json();
    for (let number = existing.length + 1; number <= 49; number++) {
      const response = await context.request.post(`/api/admin/events/${DEMO_EVENT_IDS.legendR}/photos`, {
        data: { image_url: `/media/events/legend-r.png?photo=${number}`, alt_fr: `Photo ${number}`, alt_en: `Photo ${number}`, order: number },
      });
      expect(response.status()).toBe(201);
    }
    await context.close();
  });

  test("agenda paginates five events and resets the page when filters change", async ({ page }) => {
    await page.goto("/agenda?past=1");
    await expect(page.locator(".event-card")).toHaveCount(5);
    await expect(page.getByTestId("agenda-event-title-0")).toHaveText("Finale");
    await page.getByRole("link", { name: "Suivant", exact: true }).click();
    await expect(page).toHaveURL(/past=1&page=2/);
    await expect(page.locator(".event-card")).toHaveCount(5);
    await page.getByRole("button", { name: "2026", exact: true }).click();
    await expect(page).not.toHaveURL(/[?&]page=/);
    await page.getByRole("button", { name: "juin", exact: true }).click();
    await expect(page.locator(".event-date-month").first()).toContainText(/juin/i);
    await page.getByRole("link", { name: "Suivant", exact: true }).click();
    await expect(page).toHaveURL(/month=6.*page=2/);
    await page.reload();
    await expect(page.getByRole("link", { name: "Aller à la page 2", exact: true })).toHaveAttribute("aria-current", "page");
    await page.goBack();
    await expect(page).not.toHaveURL(/[?&]page=/);
  });

  test("album order follows event dates and preserves the list page on return", async ({ page }) => {
    await page.goto("/galerie");
    await expect(page.locator(".media-link")).toHaveCount(5);
    await expect(page.getByTestId("gallery-index-item-0")).toContainText("Deep Session");
    await page.getByRole("link", { name: "Suivant", exact: true }).click();
    await expect(page.locator(".media-link")).toHaveCount(1);
    await page.getByTestId("gallery-index-item-0").click();
    await expect(page).toHaveURL(/albumsPage=2/);
    await page.locator(".back-link").click();
    await expect(page).toHaveURL(/\/galerie\?page=2$/);
  });

  test("photos paginate by 24 and lightbox navigation crosses page boundaries", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", request => { if (request.url().includes("/api/gallery/")) requests.push(request.url()); });
    await page.goto("/galerie/legend-r");
    await expect(page.locator(".gallery-photo")).toHaveCount(24);
    expect(requests).toHaveLength(0);
    await page.getByTestId("gallery-photo-23").click();
    await expect(page.locator(".inside-lightbox-counter")).toContainText("24 / 49");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".inside-lightbox-counter")).toContainText("25 / 49");
    await expect(page.locator(".inside-lightbox-img")).toHaveAttribute("alt", "Photo 25");
    expect(requests).toHaveLength(1);
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".inside-lightbox-counter")).toContainText("24 / 49");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("link", { name: "Suivant", exact: true }).click();
    await expect(page.locator(".gallery-photo")).toHaveCount(24);
    await expect(page.getByTestId("gallery-photo-0")).toHaveAttribute("alt", "Photo 25");
    await page.getByRole("link", { name: "Suivant", exact: true }).click();
    await expect(page.locator(".gallery-photo")).toHaveCount(1);
    await page.getByTestId("gallery-photo-0").click();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".inside-lightbox-counter")).toContainText("1 / 49");
    await expect(page.locator(".inside-lightbox-img")).toHaveAttribute("alt", "Affiche Legend R");
  });

  test("a failed lightbox page can be retried without closing the viewer", async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/gallery/legend-r?page=2", async route => {
      if (attempts++ === 0) await route.fulfill({ status: 503, body: "Unavailable" });
      else await route.continue();
    });
    await page.goto("/galerie/legend-r");
    await page.getByTestId("gallery-photo-23").click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Impossible de charger cette photo.")).toBeVisible();
    await page.getByRole("button", { name: "Réessayer" }).click();
    await expect(page.locator(".inside-lightbox-img")).toHaveAttribute("alt", "Photo 25");
  });

  test("loading and broken media keep a stable frame and respect reduced motion", async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/media/events/r-family.png", async route => { await gate; await route.abort(); });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/agenda?past=1", { waitUntil: "domcontentloaded" });
    const cover = page.locator(".event-card-image").first();
    await expect(cover).toHaveAttribute("data-media-state", "loading");
    expect(await cover.evaluate(element => getComputedStyle(element).animationName)).toBe("none");
    const before = await cover.boundingBox();
    release();
    await expect(cover).toHaveAttribute("data-media-state", "error");
    await expect(cover).toHaveAttribute("src", "/media/image-unavailable.svg");
    const after = await cover.boundingBox();
    expect(after?.height).toBe(before?.height);
  });

  test("mobile and English pagination work and contact links have no decorative icons", async ({ page, context, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await context.addCookies([{ name: "NEXT_LOCALE", value: "en", url: baseURL! }]);
    await page.goto("/agenda?past=1");
    await page.getByRole("link", { name: "Next", exact: true }).click();
    await expect(page.locator(".pagination-summary")).toHaveText(/Page 2 of/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.goto("/contact");
    await expect(page.locator(".contact-item-icon")).toHaveCount(0);
    await expect(page.locator('.contact-methods a[href="mailto:contact@r-club.fr"]')).toHaveCount(1);
    await expect(page.locator(".contact-hero-img")).toHaveAttribute("data-media-state", "loaded");
  });
});
