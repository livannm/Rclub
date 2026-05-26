import Link from "next/link";
import { EventFormFields } from "@/components/admin/event-form-fields";
import { createEventAction } from "@/lib/admin/event-actions";

type NewEventPageProps = {
  searchParams: Promise<{ date?: string; message?: string }>;
};

function defaultEndFromStart(startsAt: string) {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) {
    return "";
  }
  const end = new Date(start);
  end.setHours(end.getHours() + 5);
  return end.toISOString().slice(0, 16);
}

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const params = await searchParams;
  const defaultStartsAt = params.date ? `${params.date}T22:00` : "";
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
