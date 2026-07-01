export interface FirebaseStorageConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId?: string;
  appId: string;
}

type Env = Record<string, string | undefined>;

const PLACEHOLDER_FRAGMENTS = ["your_", "xxxx", "your-project"];

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_FRAGMENTS.some((fragment) => lower.includes(fragment))) return null;
  return trimmed;
}

/**
 * Returns a usable Firebase (client SDK) configuration only when the required
 * web-app config values are present and are not `.env.example` placeholders.
 * Returns `null` otherwise, which makes the media layer transparently fall back
 * to local disk storage in development (mirroring the in-memory DB fallback).
 */
export function getFirebaseStorageConfig(env: Env = process.env): FirebaseStorageConfig | null {
  const apiKey = clean(env.FIREBASE_API_KEY);
  const projectId = clean(env.FIREBASE_PROJECT_ID);
  const storageBucket = clean(env.FIREBASE_STORAGE_BUCKET);
  const appId = clean(env.FIREBASE_APP_ID);

  if (!apiKey || !projectId || !storageBucket || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain: clean(env.FIREBASE_AUTH_DOMAIN) ?? `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket,
    messagingSenderId: clean(env.FIREBASE_MESSAGING_SENDER_ID) ?? undefined,
    appId
  };
}

export function isCloudStorageEnabled(env: Env = process.env): boolean {
  return getFirebaseStorageConfig(env) !== null;
}
