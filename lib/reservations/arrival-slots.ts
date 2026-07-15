export const PUBLIC_ARRIVAL_SLOTS = [
  "23:00",
  "23:30",
  "00:00",
  "00:30",
  "01:00",
  "01:30",
] as const;

export const ADMIN_EXTENDED_ARRIVAL_SLOTS = [
  "02:00",
  "02:30",
  "03:00",
] as const;

export const ALL_ARRIVAL_SLOTS = [
  ...PUBLIC_ARRIVAL_SLOTS,
  ...ADMIN_EXTENDED_ARRIVAL_SLOTS,
] as const;

export type PublicArrivalSlot = (typeof PUBLIC_ARRIVAL_SLOTS)[number];
export type AdminArrivalSlot = (typeof ALL_ARRIVAL_SLOTS)[number];

export function isPublicArrivalSlot(value: string): value is PublicArrivalSlot {
  return (PUBLIC_ARRIVAL_SLOTS as readonly string[]).includes(value);
}

export function isAdminArrivalSlot(value: string): value is AdminArrivalSlot {
  return (ALL_ARRIVAL_SLOTS as readonly string[]).includes(value);
}

/** Format "23:00" as "23h00" */
export function formatArrivalTimeLabel(slot: string): string {
  return slot.replace(":", "h");
}
