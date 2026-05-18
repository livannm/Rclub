export function isDatabaseEnabled() {
  return Boolean(process.env.DATABASE_URL?.trim());
}
