import { formatArrivalTimeLabel } from "./arrival-slots";

const PARIS_TZ = "Europe/Paris";
const POST_MIDNIGHT_HOUR_THRESHOLD = 12;

/**
 * Resolves the real arrival instant for a nightclub booking.
 * Times before noon on the chosen evening date are treated as the next calendar day.
 */
export function resolveArrivalInstant(
  dateRequested: string,
  arrivalTime: string,
  timeZone = PARIS_TZ
): Date {
  const [hourStr, minuteStr] = arrivalTime.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr ?? 0);

  const base = new Date(`${dateRequested}T12:00:00`);
  const dayOffset = hour < POST_MIDNIGHT_HOUR_THRESHOLD ? 1 : 0;
  const arrivalDate = new Date(base);
  arrivalDate.setDate(arrivalDate.getDate() + dayOffset);

  const y = arrivalDate.getFullYear();
  const m = String(arrivalDate.getMonth() + 1).padStart(2, "0");
  const d = String(arrivalDate.getDate()).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");

  const isoLocal = `${y}-${m}-${d}T${h}:${min}:00`;
  return parseInTimeZone(isoLocal, timeZone);
}

function parseInTimeZone(isoLocal: string, timeZone: string): Date {
  const [datePart, timePart] = isoLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second ?? 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(utcGuess);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );

  const offset = asUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offset);
}

export function formatArrivalDisplay(
  dateRequested: string,
  arrivalTime: string,
  locale: string
): string {
  const instant = resolveArrivalInstant(dateRequested, arrivalTime);
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";

  const eveningLabel = new Date(`${dateRequested}T12:00:00`).toLocaleDateString(intlLocale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const [hour] = arrivalTime.split(":").map(Number);
  if (hour < POST_MIDNIGHT_HOUR_THRESHOLD) {
    const arrivalLabel = instant.toLocaleDateString(intlLocale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return `${eveningLabel} · arrivée ${arrivalLabel} ${formatArrivalTimeLabel(arrivalTime)}`;
  }

  return `${eveningLabel} · ${formatArrivalTimeLabel(arrivalTime)}`;
}

export function isArrivalInPast(
  dateRequested: string | undefined,
  arrivalTime: string | undefined,
  now = new Date()
): boolean {
  if (!dateRequested) return false;
  if (!arrivalTime) {
    const endOfDay = new Date(`${dateRequested}T23:59:59`);
    return endOfDay < now;
  }
  return resolveArrivalInstant(dateRequested, arrivalTime) < now;
}
