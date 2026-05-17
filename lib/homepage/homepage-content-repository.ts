import type { HomepageContent, HomepageContentPayload } from "@/lib/homepage/homepage-content-schema";

export interface HomepageContentRepository {
  get(): Promise<HomepageContent>;
  save(payload: HomepageContentPayload): Promise<HomepageContent>;
}
