import { z } from "zod";
import { getContactEmail } from "@/lib/email/resend-client";
import type { SiteAssetRepository } from "@/lib/site-assets/site-asset-repository";

const STORAGE_KEY = "reservation_notify_emails" as const;

const emailListSchema = z.array(z.string().email("Adresse email invalide."));

export class ReservationNotifyServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseStoredEmails(raw: string | null): string[] {
  if (!raw?.trim()) return [];

  try {
    const parsed = emailListSchema.parse(JSON.parse(raw));
    return [...new Set(parsed.map(normalizeEmail))];
  } catch {
    return [];
  }
}

export class ReservationNotifyService {
  constructor(private readonly siteAssets: SiteAssetRepository) {}

  async listEmails(): Promise<string[]> {
    const raw = await this.siteAssets.get(STORAGE_KEY);
    return parseStoredEmails(raw);
  }

  async addEmail(email: string): Promise<string[]> {
    const normalized = normalizeEmail(email);
    const parsed = z.string().email("Adresse email invalide.").safeParse(normalized);
    if (!parsed.success) {
      throw new ReservationNotifyServiceError(
        parsed.error.issues[0]?.message ?? "Adresse email invalide."
      );
    }

    const current = await this.listEmails();
    if (current.includes(normalized)) {
      throw new ReservationNotifyServiceError("Cette adresse est déjà dans la liste.");
    }

    const next = [...current, normalized];
    await this.siteAssets.set(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  async removeEmail(email: string): Promise<string[]> {
    const normalized = normalizeEmail(email);
    const next = (await this.listEmails()).filter((item) => item !== normalized);
    await this.siteAssets.set(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  /**
   * Returns admin-configured recipients, or falls back to `RESEND_CONTACT_TO`
   * when the list is empty (backward compatibility).
   */
  async resolveNotificationRecipients(
    env: Record<string, string | undefined> = process.env
  ): Promise<string[]> {
    const fromAdmin = await this.listEmails();
    if (fromAdmin.length > 0) return fromAdmin;

    const contact = getContactEmail(env);
    return contact ? [normalizeEmail(contact)] : [];
  }
}
