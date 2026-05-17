import { expect, test } from "@playwright/test";
import { loginAsAdmin, createEvent } from "./utils/admin";

const PHOTO_URL = "https://picsum.photos/seed/rclub-test/400/300";
const CAPTION_FR = "Photo de test FR";
const CAPTION_EN = "Test photo EN";

test.describe("F-11 – Admin photo management", () => {
  test("admin can add a photo to an event and it appears in the gallery", async ({ page }) => {
    const slug = `test-gallery-${Date.now()}`;

    await loginAsAdmin(page);
    await createEvent(page, {
      slug,
      title: `Gallery Test ${Date.now()}`,
      startsAt: "2099-09-01T20:00",
      endsAt: "2099-09-02T02:00"
    });

    await page.goto("/admin/events");
    const eventCard = page.locator("article").filter({ hasText: slug });
    await expect(eventCard).toBeVisible();

    const addPhotoForm = eventCard.locator(`[data-testid="add-photo-form-${slug}"]`);
    await addPhotoForm.getByLabel(`URL photo ${slug}`).fill(PHOTO_URL);
    await addPhotoForm.getByLabel(`Legende FR ${slug}`).fill(CAPTION_FR);
    await addPhotoForm.getByLabel(`Legende EN ${slug}`).fill(CAPTION_EN);
    await addPhotoForm.getByRole("button", { name: "Ajouter la photo" }).click();

    await expect(page).toHaveURL(/\/admin\/events/);
    const updatedCard = page.locator("article").filter({ hasText: slug });
    await expect(updatedCard.getByText(PHOTO_URL)).toBeVisible();

    await page.goto(`/galerie/${slug}`);
    await expect(page.getByTestId("gallery-photo-0")).toBeVisible();
    await expect(page.getByTestId("gallery-photo-0")).toHaveAttribute("src", PHOTO_URL);
  });

  test("admin can delete a photo and it disappears from the gallery", async ({ page }) => {
    const slug = `test-gallery-del-${Date.now()}`;

    await loginAsAdmin(page);
    await createEvent(page, {
      slug,
      title: `Gallery Del Test ${Date.now()}`,
      startsAt: "2099-09-01T20:00",
      endsAt: "2099-09-02T02:00"
    });

    await page.goto("/admin/events");
    const eventCard = page.locator("article").filter({ hasText: slug });
    const addPhotoForm = eventCard.locator(`[data-testid="add-photo-form-${slug}"]`);
    await addPhotoForm.getByLabel(`URL photo ${slug}`).fill(PHOTO_URL);
    await addPhotoForm.getByRole("button", { name: "Ajouter la photo" }).click();

    await expect(page).toHaveURL(/\/admin\/events/);
    await page.goto(`/galerie/${slug}`);
    await expect(page.getByTestId("gallery-photo-0")).toBeVisible();

    await page.goto("/admin/events");
    const cardAfterAdd = page.locator("article").filter({ hasText: slug });
    const deleteBtn = cardAfterAdd.getByRole("button", { name: "Supprimer la photo" }).first();
    await deleteBtn.click();

    await expect(page).toHaveURL(/\/admin\/events/);

    await page.goto(`/galerie/${slug}`);
    await expect(page.getByTestId("gallery-empty")).toBeVisible();
  });

  test("admin can reorder photos and gallery respects the new order", async ({ page }) => {
    const slug = `test-gallery-order-${Date.now()}`;

    await loginAsAdmin(page);
    await createEvent(page, {
      slug,
      title: `Gallery Order Test ${Date.now()}`,
      startsAt: "2099-09-01T20:00",
      endsAt: "2099-09-02T02:00"
    });

    const photoA = "https://picsum.photos/seed/alpha/400/300";
    const photoB = "https://picsum.photos/seed/beta/400/300";

    await page.goto("/admin/events");
    let eventCard = page.locator("article").filter({ hasText: slug });

    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByLabel(`URL photo ${slug}`).fill(photoA);
    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByLabel(`Ordre photo ${slug}`).fill("1");
    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByRole("button", { name: "Ajouter la photo" }).click();

    await expect(page).toHaveURL(/\/admin\/events/);
    eventCard = page.locator("article").filter({ hasText: slug });

    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByLabel(`URL photo ${slug}`).fill(photoB);
    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByLabel(`Ordre photo ${slug}`).fill("2");
    await eventCard.locator(`[data-testid="add-photo-form-${slug}"]`)
      .getByRole("button", { name: "Ajouter la photo" }).click();

    await expect(page).toHaveURL(/\/admin\/events/);

    await page.goto(`/galerie/${slug}`);
    await expect(page.getByTestId("gallery-photo-0")).toHaveAttribute("src", photoA);
    await expect(page.getByTestId("gallery-photo-1")).toHaveAttribute("src", photoB);

    await page.goto("/admin/events");
    eventCard = page.locator("article").filter({ hasText: slug });
    const firstPhotoItem = eventCard.getByTestId(`admin-photo-item-${slug}-0`);
    const reorderForm = firstPhotoItem.locator("form", { has: page.getByRole("button", { name: "Reordonner" }) });
    await reorderForm.getByLabel("Ordre").fill("10");
    await reorderForm.getByRole("button", { name: "Reordonner" }).click();

    await expect(page).toHaveURL(/\/admin\/events/);

    await page.goto(`/galerie/${slug}`);
    await expect(page.getByTestId("gallery-photo-0")).toHaveAttribute("src", photoB);
    await expect(page.getByTestId("gallery-photo-1")).toHaveAttribute("src", photoA);
  });
});
