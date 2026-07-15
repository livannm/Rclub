"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ClubEvent } from "@/lib/events/event-schema";
import { formatEventTime } from "@/lib/utils/format-date";
import { formatRequestedDate } from "@/lib/utils/club-date";
import type { AppLocale } from "@/i18n/locales";

type Props = {
  labelText: string;
  locale: AppLocale;
  defaultValue?: string;
  minDate: string;
};

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; events: ClubEvent[] }
  | { status: "error" };

async function fetchEventsByDate(date: string, signal?: AbortSignal) {
  const res = await globalThis.fetch(`/api/events/by-date?date=${date}`, { signal });
  if (!res.ok) throw new Error("fetch failed");
  const data = await res.json();
  return (data.events ?? []) as ClubEvent[];
}

export function DatePickerWithEventHint({ labelText, locale, defaultValue, minDate }: Props) {
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [selectedDate, setSelectedDate] = useState(defaultValue ?? "");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!defaultValue) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setFetchState({ status: "loading" });
    fetchEventsByDate(defaultValue, controller.signal)
      .then((events) => setFetchState({ status: "done", events }))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setFetchState({ status: "error" });
      });
    return () => controller.abort();
  }, [defaultValue]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setSelectedDate(date);

      if (!date) {
        setFetchState({ status: "idle" });
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setFetchState({ status: "loading" });

      try {
        const events = await fetchEventsByDate(date, controller.signal);
        setFetchState({ status: "done", events });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setFetchState({ status: "error" });
      }
    },
    []
  );

  const hasEvent = fetchState.status === "done" && fetchState.events.length > 0;
  const event = hasEvent ? fetchState.events[0] : null;

  return (
    <div className="rclub-date-picker-wrapper">
      <label className="rclub-field" htmlFor="date_requested">
        <span className="rclub-label">{labelText}</span>
        <input
          id="date_requested"
          name="date_requested"
          type="date"
          required
          min={minDate}
          defaultValue={defaultValue}
          className="rclub-input rclub-input-date"
          onChange={handleChange}
        />
      </label>

      {fetchState.status === "loading" && (
        <div className="rclub-event-hint rclub-event-hint--loading" aria-live="polite">
          <span className="rclub-event-hint__dot" aria-hidden="true" />
          <span className="rclub-event-hint__dot" aria-hidden="true" />
          <span className="rclub-event-hint__dot" aria-hidden="true" />
        </div>
      )}

      {hasEvent && event && selectedDate && (
        <div className="rclub-event-hint" role="status" aria-live="polite">
          <input type="hidden" name="event_id" value={event.id} />
          {event.cover_image_url && (
            <div className="rclub-event-hint__img-wrap" aria-hidden="true">
              <img
                src={event.cover_image_url}
                alt=""
                className="rclub-event-hint__img"
                loading="lazy"
              />
              <div className="rclub-event-hint__img-scrim" />
            </div>
          )}
          <div className="rclub-event-hint__body">
            <span className="rclub-event-hint__kicker">
              {locale === "fr" ? "Événement ce soir-là" : "Event that night"}
            </span>
            <p className="rclub-event-hint__title">
              {locale === "fr" ? event.title_fr : event.title_en}
            </p>
            <p className="rclub-event-hint__meta">
              {formatRequestedDate(selectedDate, locale)}
              {" · "}
              {formatEventTime(event.starts_at)}
            </p>
            {event.location && (
              <p className="rclub-event-hint__location">{event.location}</p>
            )}
          </div>
          <div className="rclub-event-hint__accent" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
