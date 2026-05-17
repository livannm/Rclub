import type { HomepageContentRepository } from "@/lib/homepage/homepage-content-repository";
import type { HomepageContent, HomepageContentPayload } from "@/lib/homepage/homepage-content-schema";

function defaultHomepageContent(): HomepageContent {
  return {
    title_fr: "Rclub",
    title_en: "Rclub",
    description_fr: "Socle MVP en cours: auth admin et gestion des evenements.",
    description_en: "MVP foundation in progress: admin auth and event management are available.",
    updated_at: new Date().toISOString()
  };
}

export class InMemoryHomepageContentRepository implements HomepageContentRepository {
  private content: HomepageContent = defaultHomepageContent();

  async get() {
    return this.content;
  }

  async save(payload: HomepageContentPayload) {
    this.content = {
      ...payload,
      updated_at: new Date().toISOString()
    };
    return this.content;
  }
}
