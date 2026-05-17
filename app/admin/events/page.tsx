import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eventPayloadFromFormData } from "@/lib/events/event-form";
import { EventServiceError } from "@/lib/events/events-service";
import { eventService } from "@/lib/events/events-service-instance";

type AdminEventsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

const EVENT_REVALIDATION_PATHS = ["/admin/events", "/agenda", "/"] as const;

function toDatetimeLocalValue(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function revalidateEventViews() {
  for (const path of EVENT_REVALIDATION_PATHS) {
    revalidatePath(path);
  }
}

function redirectAfterEventActionError(error: unknown): never {
  if (error instanceof EventServiceError) {
    redirect(`/admin/events?message=${encodeURIComponent(error.message)}`);
  }

  throw error;
}

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const params = await searchParams;
  const events = await eventService.listAll();

  async function createEventAction(formData: FormData) {
    "use server";
    try {
      const payload = eventPayloadFromFormData(formData);
      await eventService.create(payload);
    } catch (error) {
      redirectAfterEventActionError(error);
    }

    revalidateEventViews();
    redirect("/admin/events");
  }

  async function updateEventAction(formData: FormData) {
    "use server";
    const eventId = formData.get("event_id");
    if (typeof eventId !== "string") {
      return;
    }

    try {
      const payload = eventPayloadFromFormData(formData);
      await eventService.update(eventId, payload);
    } catch (error) {
      redirectAfterEventActionError(error);
    }

    revalidateEventViews();
    redirect("/admin/events");
  }

  async function deleteEventAction(formData: FormData) {
    "use server";
    const eventId = formData.get("event_id");
    if (typeof eventId !== "string") {
      return;
    }

    try {
      await eventService.delete(eventId);
    } catch (error) {
      redirectAfterEventActionError(error);
    }

    revalidateEventViews();
    redirect("/admin/events");
  }

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <h1>Administration - Evenements</h1>
      <p>
        Cree, modifie et supprime les evenements. Les evenements publies apparaissent sur
        l&apos;agenda.
      </p>
      {params.message ? <p style={{ color: "#f87171" }}>{params.message}</p> : null}

      <section style={{ border: "1px solid #333", padding: "1rem" }}>
        <h2>Creer un evenement</h2>
        <form action={createEventAction} style={{ display: "grid", gap: "0.5rem" }}>
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" required />
          <label htmlFor="title_fr">Titre (FR)</label>
          <input id="title_fr" name="title_fr" required />
          <label htmlFor="title_en">Titre (EN)</label>
          <input id="title_en" name="title_en" required />
          <label htmlFor="description_fr">Description (FR)</label>
          <textarea id="description_fr" name="description_fr" required />
          <label htmlFor="description_en">Description (EN)</label>
          <textarea id="description_en" name="description_en" required />
          <label htmlFor="starts_at">Debut</label>
          <input id="starts_at" name="starts_at" type="datetime-local" required />
          <label htmlFor="ends_at">Fin</label>
          <input id="ends_at" name="ends_at" type="datetime-local" />
          <label htmlFor="location">Lieu</label>
          <input id="location" name="location" defaultValue="Rclub Strasbourg" required />
          <label htmlFor="cover_image_url">Cover image URL</label>
          <input id="cover_image_url" name="cover_image_url" type="url" required />
          <label htmlFor="hero_video_url">Hero video URL</label>
          <input id="hero_video_url" name="hero_video_url" type="url" />
          <label htmlFor="ticket_url">Ticket URL</label>
          <input id="ticket_url" name="ticket_url" type="url" />
          <label htmlFor="is_published">
            <input id="is_published" name="is_published" type="checkbox" /> Publier
          </label>
          <button type="submit">Ajouter l&apos;evenement</button>
        </form>
      </section>

      <section style={{ border: "1px solid #333", padding: "1rem" }}>
        <h2>Evenements existants</h2>
        {events.length === 0 ? <p>Aucun evenement pour le moment.</p> : null}
        <div style={{ display: "grid", gap: "1rem" }}>
          {events.map((event) => (
            <article key={event.id} style={{ border: "1px solid #444", padding: "1rem" }}>
              <h3>
                {event.title_fr} ({event.slug})
              </h3>
              <p>
                Debut: {new Date(event.starts_at).toLocaleString("fr-FR")} - Publie:{" "}
                {event.is_published ? "oui" : "non"}
              </p>

              <form action={updateEventAction} style={{ display: "grid", gap: "0.35rem" }}>
                <input type="hidden" name="event_id" value={event.id} />
                <label>
                  Titre FR
                  <input
                    aria-label={`Titre FR ${event.slug}`}
                    name="title_fr"
                    defaultValue={event.title_fr}
                    required
                  />
                </label>
                <label>
                  Titre EN
                  <input name="title_en" defaultValue={event.title_en} required />
                </label>
                <label>
                  Slug
                  <input name="slug" defaultValue={event.slug} required />
                </label>
                <label>
                  Description FR
                  <textarea name="description_fr" defaultValue={event.description_fr} required />
                </label>
                <label>
                  Description EN
                  <textarea name="description_en" defaultValue={event.description_en} required />
                </label>
                <label>
                  Debut
                  <input
                    name="starts_at"
                    type="datetime-local"
                    defaultValue={toDatetimeLocalValue(event.starts_at)}
                    required
                  />
                </label>
                <label>
                  Fin
                  <input
                    name="ends_at"
                    type="datetime-local"
                    defaultValue={event.ends_at ? toDatetimeLocalValue(event.ends_at) : ""}
                  />
                </label>
                <label>
                  Lieu
                  <input name="location" defaultValue={event.location} required />
                </label>
                <label>
                  Cover image URL
                  <input name="cover_image_url" type="url" defaultValue={event.cover_image_url} required />
                </label>
                <label>
                  Hero video URL
                  <input name="hero_video_url" type="url" defaultValue={event.hero_video_url ?? ""} />
                </label>
                <label>
                  Ticket URL
                  <input name="ticket_url" type="url" defaultValue={event.ticket_url ?? ""} />
                </label>
                <label>
                  <input name="is_published" type="checkbox" defaultChecked={event.is_published} />{" "}
                  Publier
                </label>
                <button type="submit">Modifier</button>
              </form>

              <form action={deleteEventAction} style={{ marginTop: "0.75rem" }}>
                <input type="hidden" name="event_id" value={event.id} />
                <button type="submit">Supprimer</button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
