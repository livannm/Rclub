import Link from "next/link";
import { EventFormFields } from "@/components/admin/event-form-fields";
import { createEventAction } from "@/lib/admin/event-actions";
import {
  DEFAULT_EVENT_DURATION_HOURS,
  DEFAULT_EVENT_START_TIME,
} from "@/lib/events/event-defaults";
import { datetimeLocalParisToIso, isoToDatetimeLocalParis } from "@/lib/utils/club-date";

type NewEventPageProps = {
  searchParams: Promise<{ date?: string; message?: string }>;
};

function defaultEndFromStart(startsAt: string) {
  const startIso = datetimeLocalParisToIso(startsAt);
  const endIso = new Date(
    new Date(startIso).getTime() + DEFAULT_EVENT_DURATION_HOURS * 60 * 60 * 1000
  ).toISOString();
  return isoToDatetimeLocalParis(endIso);
}

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const params = await searchParams;
  const defaultStartsAt = params.date ? `${params.date}T${DEFAULT_EVENT_START_TIME}` : "";
  const defaultEndsAt = defaultStartsAt ? defaultEndFromStart(defaultStartsAt) : "";

  return (
    <main className="admin-shell admin-shell-narrow">
      <header className="admin-header">
        <div>
          <h1>Nouvel événement</h1>
          {params.date ? <p>Date présélectionnée : {params.date}</p> : null}
        </div>
        <Link className="button button-ghost" href="/admin/events">
          ← Calendrier
        </Link>
      </header>

      {params.message ? <p className="status status-error">{params.message}</p> : null}

      <section className="admin-card">
        <form action={createEventAction} className="site-grid">
          <EventFormFields defaultStartsAt={defaultStartsAt} defaultEndsAt={defaultEndsAt} />
          <button type="submit">Ajouter l&apos;événement</button>
        </form>
      </section>
    </main>
  );
}
