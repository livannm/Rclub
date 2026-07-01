import { Resend, type CreateEmailOptions } from "resend";

type Env = Record<string, string | undefined>;

const PLACEHOLDER_FRAGMENTS = ["xxxx", "your-domain", "your_domain", "your-email"];

function isPlaceholder(value: string | undefined): boolean {
  const v = value?.trim().toLowerCase();
  if (!v) return true;
  return PLACEHOLDER_FRAGMENTS.some((fragment) => v.includes(fragment));
}

let _client: Resend | null = null;

/**
 * Returns the sender address. Falls back to Resend's shared sandbox sender
 * (`onboarding@resend.dev`) when `RESEND_FROM_EMAIL` is unset or a placeholder,
 * so transactional emails still work in dev without a verified domain.
 */
export function getFromEmail(env: Env = process.env): string {
  const value = env.RESEND_FROM_EMAIL?.trim();
  return value && !isPlaceholder(value) ? value : "onboarding@resend.dev";
}

/** Admin recipient for reservation recap emails, or `null` when not configured. */
export function getContactEmail(env: Env = process.env): string | null {
  const value = env.RESEND_CONTACT_TO?.trim();
  return value && !isPlaceholder(value) ? value : null;
}

/** True when a real (non-placeholder) Resend API key is set. */
export function isEmailConfigured(env: Env = process.env): boolean {
  return !isPlaceholder(env.RESEND_API_KEY);
}

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (isPlaceholder(apiKey)) {
    throw new Error(
      "RESEND_API_KEY n'est pas configurée (valeur placeholder). " +
        "Renseignez une vraie clé Resend dans .env.local pour activer l'envoi d'emails."
    );
  }
  if (!_client) {
    _client = new Resend(apiKey);
  }
  return _client;
}

/**
 * Sends an email and throws when Resend reports an error. The Resend SDK does
 * NOT throw on API-level failures (it returns `{ data, error }`), so callers
 * must go through this helper to surface refused/failed sends.
 */
export async function sendEmail(payload: CreateEmailOptions): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send(payload);
  if (error) {
    throw new Error(`Resend a refusé l'envoi: ${error.message} (${error.name})`);
  }
}

/** @deprecated use `getFromEmail()` so placeholder detection applies. */
export const FROM_EMAIL = getFromEmail();
