import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eventPayloadFromFormData } from "@/lib/events/event-form";
import { EventServiceError } from "@/lib/events/events-service";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";

type AdminEventsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

const EVENT_REVALIDATION_PATHS = ["/admin/events", "/agenda", "/"] as const;
const GALLERY_REVALIDATION_PATHS = ["/galerie"] as const;

function toDatetimeLocalValue(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function revalidateEventViews() {
  for (const path of EVENT_REVALIDATION_PATHS) {
    revalidatePath(path);
  }
}

function revalidateGalleryViews(slug: string) {
  for (const path of GALLERY_REVALIDATION_PATHS) {
    revalidatePath(path);
  }
  revalidatePath(`/galerie/${slug}`);
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

  const eventsWithPhotos = await Promise.all(
    events.map(async (event) => ({
      event,
      photos: await galleryService.getPhotosForEvent(event.id)
    }))
  );

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

  async function addPhotoAction(formData: FormData) {
    "use server";
    const eventId = formData.get("event_id");
    const eventSlug = formData.get("event_slug");
    const imageUrl = formData.get("image_url");
    const altFr = formData.get("alt_fr");
    const altEn = formData.get("alt_en");
    const sortOrderRaw = formData.get("sort_order");

    if (
      typeof eventId !== "string" ||
      typeof eventSlug !== "string" ||
      typeof imageUrl !== "string" ||
      !imageUrl
    ) {
      redirect(`/admin/events?message=${encodeURIComponent("URL de la photo requise.")}`);
    }

    const sortOrder = sortOrderRaw ? parseInt(String(sortOrderRaw), 10) : 0;

    await galleryService.addPhoto({
      event_id: eventId,
      event_slug: eventSlug,
      image_url: imageUrl,
      alt_fr: typeof altFr === "string" ? altFr : "",
      alt_en: typeof altEn === "string" ? altEn : "",
      order: isNaN(sortOrder) ? 0 : sortOrder
    });

    revalidateGalleryViews(eventSlug);
    redirect("/admin/events");
  }

  async function deletePhotoAction(formData: FormData) {
    "use server";
    const photoId = formData.get("photo_id");
    const eventSlug = formData.get("event_slug");

    if (typeof photoId !== "string" || typeof eventSlug !== "string") {
      return;
    }

    await galleryService.deletePhoto(photoId);
    revalidateGalleryViews(eventSlug);
    redirect("/admin/events");
  }

  async function reorderPhotoAction(formData: FormData) {
    "use server";
    const photoId = formData.get("photo_id");
    const sortOrderRaw = formData.get("sort_order");
    const eventSlug = formData.get("event_slug");

    if (typeof photoId !== "string" || typeof eventSlug !== "string") {
      return;
    }

    const sortOrder = parseInt(String(sortOrderRaw), 10);
    if (isNaN(sortOrder)) {
      return;
    }

    await galleryService.reorderPhoto(photoId, sortOrder);
    revalidateGalleryViews(eventSlug);
    redirect("/admin/events");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="page-kicker">Admin</p>
          <h1>Administration – Événements</h1>
          <p>
            Créez, modifiez et supprimez les événements. Les événements publiés apparaissent sur
            l&apos;agenda.
          </p>
        </div>
        <div className="admin-actions">
          <a className="button button-secondary" href="/admin">Retour au dashboard</a>
        </div>
      </header>
      {params.message ? <p className="status status-error">{params.message}</p> : null}

      <section className="admin-card admin-section">
        <h2>Créer un événement</h2>
        <form action={createEventAction} className="admin-form">
          <label htmlFor="slug">Slug<input id="slug" name="slug" required /></label>
          <label htmlFor="title_fr">Titre (FR)<input id="title_fr" name="title_fr" required /></label>
          <label htmlFor="title_en">Titre (EN)<input id="title_en" name="title_en" required /></label>
          <label htmlFor="description_fr">Description (FR)<textarea id="description_fr" name="description_fr" required /></label>
          <label htmlFor="description_en">Description (EN)<textarea id="description_en" name="description_en" required /></label>
          <label htmlFor="starts_at">Debut<input id="starts_at" name="starts_at" type="datetime-local" required /></label>
          <label htmlFor="ends_at">Fin<input id="ends_at" name="ends_at" type="datetime-local" /></label>
          <label htmlFor="location">Lieu<input id="location" name="location" defaultValue="Rclub Strasbourg" required /></label>
          <label htmlFor="cover_image_url">URL image de couverture<input id="cover_image_url" name="cover_image_url" type="url" required /></label>
          <label htmlFor="hero_video_url">URL vidéo hero<input id="hero_video_url" name="hero_video_url" type="url" /></label>
          <label htmlFor="ticket_url">URL billetterie<input id="ticket_url" name="ticket_url" type="url" /></label>
          <label htmlFor="is_published" className="checkbox-label">
            <input id="is_published" name="is_published" type="checkbox" /> Publier
          </label>
          <button type="submit">Ajouter l&apos;événement</button>
        </form>
      </section>

      <section className="admin-card admin-section">
        <h2>Événements existants</h2>
        {eventsWithPhotos.length === 0 ? <p>Aucun événement pour le moment.</p> : null}
        <div className="site-grid">
          {eventsWithPhotos.map(({ event, photos }) => (
            <article key={event.id} className="event-admin-card">
              <h3>
                {event.title_fr} ({event.slug})
              </h3>
              <p>
                Début&nbsp;: {new Date(event.starts_at).toLocaleString("fr-FR")} — Publié&nbsp;:{" "}
                {event.is_published ? "oui" : "non"}
              </p>

              <form action={updateEventAction} className="admin-form">
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
                  Début
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
                  URL image de couverture
                  <input name="cover_image_url" type="url" defaultValue={event.cover_image_url} required />
                </label>
                <label>
                  URL vidéo hero
                  <input name="hero_video_url" type="url" defaultValue={event.hero_video_url ?? ""} />
                </label>
                <label>
                  URL billetterie
                  <input name="ticket_url" type="url" defaultValue={event.ticket_url ?? ""} />
                </label>
                <label>
                  <input name="is_published" type="checkbox" defaultChecked={event.is_published} />{" "}
                  Publier
                </label>
                <button type="submit">Modifier</button>
              </form>

              <form action={deleteEventAction}>
                <input type="hidden" name="event_id" value={event.id} />
                <button type="submit" className="button-secondary">Supprimer l&apos;événement</button>
              </form>

              {/* Section gestion des photos */}
              <section
                data-testid={`photos-section-${event.slug}`}
                className="admin-section"
              >
                <h4>Photos ({photos.length} photo{photos.length !== 1 ? "s" : ""})</h4>

                {photos.length > 0 ? (
                  <ul className="admin-photo-list">
                    {photos.map((photo, index) => (
                      <li
                        key={photo.id}
                        data-testid={`admin-photo-item-${event.slug}-${index}`}
                        className="admin-photo-item"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.image_url}
                          alt={photo.alt_fr}
                          width={60}
                          height={40}
                        />
                        <span className="admin-photo-url">
                          {photo.image_url}
                        </span>

                        <form action={reorderPhotoAction} className="inline-form">
                          <input type="hidden" name="photo_id" value={photo.id} />
                          <input type="hidden" name="event_slug" value={event.slug} />
                          <label>
                            Ordre
                            <input
                              name="sort_order"
                              type="number"
                              defaultValue={photo.order}
                            />
                          </label>
                          <button type="submit" className="button-ghost">
                            Reordonner
                          </button>
                        </form>

                        <form action={deletePhotoAction}>
                          <input type="hidden" name="photo_id" value={photo.id} />
                          <input type="hidden" name="event_slug" value={event.slug} />
                          <button
                            type="submit"
                            data-testid={`delete-photo-${photo.id}`}
                            className="button-secondary"
                          >
                            Supprimer la photo
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p data-testid={`photos-empty-${event.slug}`}>
                    Aucune photo pour cet événement.
                  </p>
                )}

                <form
                  action={addPhotoAction}
                  data-testid={`add-photo-form-${event.slug}`}
                  className="admin-form"
                >
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="event_slug" value={event.slug} />
                  <label>
                    URL de la photo
                    <input
                      name="image_url"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      aria-label={`URL photo ${event.slug}`}
                      required
                    />
                  </label>
                  <label>
                    Légende FR
                    <input
                      name="alt_fr"
                      placeholder="Légende en français"
                      aria-label={`Légende FR ${event.slug}`}
                    />
                  </label>
                  <label>
                    Légende EN
                    <input
                      name="alt_en"
                      placeholder="Caption in English"
                      aria-label={`Légende EN ${event.slug}`}
                    />
                  </label>
                  <label>
                    Ordre
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={photos.length + 1}
                      aria-label={`Ordre photo ${event.slug}`}
                    />
                  </label>
                  <button type="submit" data-testid={`add-photo-btn-${event.slug}`}>
                    Ajouter la photo
                  </button>
                </form>
              </section>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
