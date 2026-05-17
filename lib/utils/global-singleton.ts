/**
 * Survives module re-evaluation in dev (HMR) and tests.
 * Useful for in-memory repositories/services that act as the temporary DB.
 */
export function getOrCreateGlobalSingleton<T>(key: string, factory: () => T): T {
  const store = globalThis as typeof globalThis & Record<string, unknown>;

  if (!store[key]) {
    store[key] = factory();
  }

  return store[key] as T;
}
