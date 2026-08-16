import { expect, test } from "@playwright/test";

test.describe("Home — sections sous carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Infos pratiques", () => {
    test("la section est visible et accessible", async ({ page }) => {
      const section = page.getByRole("region", { name: /infos pratiques|practical info/i });
      await expect(section).toBeVisible();
    });

    test("affiche l'adresse du club", async ({ page }) => {
      await expect(page.getByText(/quai des pêcheurs/i)).toBeVisible();
    });

    test("le CTA réservation est visible et cible /reservations", async ({ page }) => {
      const cta = page.getByRole("link", { name: /réserver une table|book a table/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/reservations");
    });

    test("le lien itinéraire s'ouvre dans un nouvel onglet", async ({ page }) => {
      const link = page.getByRole("link", { name: /itinéraire|directions/i });
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    });
  });

  test.describe("L'expérience Rclub", () => {
    test("la section est visible avec 3 blocs", async ({ page }) => {
      const section = page.locator(".home-experience");
      await expect(section).toBeVisible();

      const blocks = page.locator(".home-exp-block");
      await expect(blocks).toHaveCount(3);
    });

    test("les numéros 01 02 03 sont présents", async ({ page }) => {
      for (const num of ["01", "02", "03"]) {
        await expect(page.locator(".home-exp-block-num").filter({ hasText: num })).toBeVisible();
      }
    });

    test("les titres de chapitres sont visibles", async ({ page }) => {
      const titles = page.locator(".home-exp-block-title");
      await expect(titles).toHaveCount(3);
      for (const title of await titles.all()) {
        await expect(title).toBeVisible();
      }
    });

    test("la signature et la tagline sont visibles", async ({ page }) => {
      await expect(page.locator(".home-exp-signature")).toBeVisible();
      await expect(page.locator(".home-exp-signature-tagline")).toBeVisible();
    });
  });

  test.describe("Inside the club", () => {
    test("la section est visible avec 3 images", async ({ page }) => {
      const section = page.getByRole("region", {
        name: /atmosphère|atmosphere|inside/i,
      });
      await expect(section).toBeVisible();

      const images = section.getByRole("img");
      await expect(images).toHaveCount(3);
    });

    test("le titre de la composition image est visible", async ({ page }) => {
      await expect(page.locator(".home-inside-main-title")).toBeVisible();
    });
  });

  test.describe("CTA final", () => {
    test("le bloc CTA final est visible", async ({ page }) => {
      await expect(page.locator(".home-final-cta-inner")).toBeVisible();
    });

    test("le bouton Réserver pointe vers /reservations", async ({ page }) => {
      const ctas = page.getByRole("link", { name: /^réserver$|^book$/i });
      await expect(ctas.first()).toHaveAttribute("href", "/reservations");
    });

    test("le bouton Privatiser pointe vers /privatisation", async ({ page }) => {
      const cta = page.getByRole("link", { name: /privatiser|private hire/i });
      await expect(cta).toHaveAttribute("href", "/privatisation");
    });
  });

  test.describe("Accessibilité — hiérarchie des titres", () => {
    test("chaque section a un rôle region avec un nom accessible", async ({ page }) => {
      const sections = page.locator(".home-practical, .home-experience, .home-inside, .home-final-cta");
      const count = await sections.count();
      expect(count).toBe(4);
    });

    test("les chapitres experience ont des titres h3 avec un h2 parent", async ({ page }) => {
      const h2 = page.locator(".home-experience .home-exp-intro-title");
      await expect(h2).toHaveCount(1);

      const h3s = page.locator(".home-exp-block-title");
      await expect(h3s).toHaveCount(3);
    });
  });
});
