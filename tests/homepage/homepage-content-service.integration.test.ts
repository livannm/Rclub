import { describe, expect, it } from "vitest";
import { InMemoryHomepageContentRepository } from "@/lib/homepage/in-memory-homepage-content-repository";
import { HomepageContentService, HomepageContentServiceError } from "@/lib/homepage/homepage-content-service";

describe("HomepageContentService", () => {
  it("saves content and updates timestamp", async () => {
    const service = new HomepageContentService(new InMemoryHomepageContentRepository());
    const initial = await service.get();

    const saved = await service.update({
      title_fr: "Nouveau titre FR",
      title_en: "New EN title",
      description_fr: "Description FR modifiee",
      description_en: "Updated EN description"
    });

    expect(saved.title_fr).toBe("Nouveau titre FR");
    expect(saved.updated_at).not.toBe(initial.updated_at);

    const readBack = await service.get();
    expect(readBack).toMatchObject({
      title_fr: "Nouveau titre FR",
      title_en: "New EN title",
      description_fr: "Description FR modifiee",
      description_en: "Updated EN description"
    });
  });

  it("rejects invalid payload", async () => {
    const service = new HomepageContentService(new InMemoryHomepageContentRepository());

    await expect(
      service.update({
        title_fr: "",
        title_en: "Title",
        description_fr: "Description",
        description_en: "Description"
      })
    ).rejects.toBeInstanceOf(HomepageContentServiceError);
  });
});
