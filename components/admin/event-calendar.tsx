"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getClubEveningDate } from "@/lib/utils/club-date";

export type AdminCalendarEvent = {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  isPublished: boolean;
};

type EventCalendarProps = {
  events: AdminCalendarEvent[];
};

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const eventsByDay = useMemo(() => {
    const map = new Map<string, AdminCalendarEvent[]>();
    for (const event of events) {
      const key = getClubEveningDate(event.startsAt);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(month);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      const key = toDateKey(day);
      return {
        date: day,
        key,
        inMonth: day.getMonth() === month.getMonth(),
        events: eventsByDay.get(key) ?? []
      };
    });
  }, [eventsByDay, month]);

  return (
    <section className="admin-calendar" aria-label="Calendrier des événements">
      <div className="admin-calendar-toolbar">
        <button type="button" className="button-ghost" onClick={() => setMonth(addMonths(month, -1))}>
          ←
        </button>
        <h2 className="admin-calendar-title">{formatMonthLabel(month)}</h2>
        <button type="button" className="button-ghost" onClick={() => setMonth(addMonths(month, 1))}>
          →
        </button>
      </div>

      <div className="admin-calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="admin-calendar-grid">
        {calendarDays.map(({ date, key, inMonth, events: dayEvents }) => (
          <div
            key={key}
            className={`admin-calendar-day${inMonth ? "" : " is-outside"}${dayEvents.length ? " has-events" : ""}`}
          >
            <Link
              href={`/admin/events/new?date=${key}`}
              className="admin-calendar-day-link"
              aria-label={`Créer un événement le ${key}`}
            >
              <span className="admin-calendar-day-number">{date.getDate()}</span>
            </Link>
            {dayEvents.length > 0 ? (
              <ul className="admin-calendar-day-events">
                {dayEvents.slice(0, 2).map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className={event.isPublished ? "" : "is-draft"}
                    >
                      {event.title}
                    </Link>
                  </li>
                ))}
                {dayEvents.length > 2 ? (
                  <li className="admin-calendar-more">+{dayEvents.length - 2}</li>
                ) : null}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
