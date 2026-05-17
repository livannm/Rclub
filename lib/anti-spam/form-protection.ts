import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export class FormProtectionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type FormProtectionOptions = {
  formName: string;
  identifier: string;
  honeypot?: string;
  maxAttempts?: number;
  windowMs?: number;
  now?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const GENERIC_PROTECTION_MESSAGE =
  "Trop de demandes ont ete envoyees. Merci de reessayer dans quelques minutes.";

function getRateLimitStore() {
  return getOrCreateGlobalSingleton<Map<string, RateLimitBucket>>("rclub:form-rate-limits", () => new Map());
}

function buildRateLimitKey(formName: string, identifier: string) {
  return `${formName}:${identifier || "anonymous"}`;
}

export function resetFormProtectionForTests() {
  getRateLimitStore().clear();
}

export function assertFormSubmissionAllowed({
  formName,
  identifier,
  honeypot,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  windowMs = DEFAULT_WINDOW_MS,
  now = Date.now()
}: FormProtectionOptions) {
  if (honeypot?.trim()) {
    throw new FormProtectionError(GENERIC_PROTECTION_MESSAGE);
  }

  const store = getRateLimitStore();
  const key = buildRateLimitKey(formName, identifier);
  const currentBucket = store.get(key);

  if (!currentBucket || currentBucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (currentBucket.count >= maxAttempts) {
    throw new FormProtectionError(GENERIC_PROTECTION_MESSAGE);
  }

  currentBucket.count += 1;
}
