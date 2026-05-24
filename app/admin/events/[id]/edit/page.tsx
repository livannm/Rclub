import Link from "next/link";
import { notFound } from "next/navigation";
import { EventFormFields } from "@/components/admin/event-form-fields";
import {
  addPhotoAction,
  deleteEventAction,
  deletePhotoAction,
  reorderPhotoAction,
  updateEventAction
} from "@/lib/admin/event-actions";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { reservationService } from "@/lib/reservations/reservation-service-instance";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    message?: string;
    created?: string;
    saved?: string;
    photoAdded?: string;
    photoDeleted?: string;
    photoReordered?: string;
  }>;
};

export default async function EditEventPage({ searchParams, params }: EditEventPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const event = await eventService.findById(id);

  if (!event) {
    notFound();
  }

  const [photos, eventReservations] = await Promise.all([
    galleryService.getPhotosForEvent(event.id),
    reservationService.listAll().then((all) => all.filter((r) => r.event_id === id))
  ]);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="page-kicker">Admin</p>
          <h1>{event.title_fr}</h1>
          <p>
            {event.slug} · {event.is_published ? "Publié" : "Brouillon"}
          </p>
        </div>
        <div className="admin-actions">
          <Link className="button button-secondary" href="/admin/events">
            Calendrier
          </Link>
          <Link className="button button-ghost" href={`/agenda/${event.slug}`} target="_blank">
            Voir la page
          </Link>
        </div>
      </header>

      {query.message ? <p className="status status-error">{query.message}</p> : null}
      {query.created === "1" ? (
        <p className="status status-success">Événement créé. Complétez les détails si besoin.</p>
      ) : null}
      {query.saved === "1" ? <p className="status status-success">Modifications enregistrées.</p> : null}
      {query.photoAdded === "1" ? <p className="status status-success">Photo ajoutée.</p> : null}
      {query.photoDeleted === "1" ? <p className="status status-success">Photo supprimée.</p> : null}
      {query.photoReordered === "1" ? (
        <p className="status status-success">Ordre des photos mis à jour.</p>
      ) : null}

      <section className="admin-card admin-section">
        <h2>Informations</h2>
        <form action={updateEventAction} className="site-grid">
          <input type="hidden" name="event_id" value={event.id} />
          <EventFormFields event={event} />
          <div className="admin-form-actions">
            <button type="submit">Enregistrer</button>
          </div>
        </form>
        <form action={deleteEventAction} className="admin-danger-form">
          <input type="hidden" name="event_id" value={event.id} />
          <button type="submit" className="button-secondary">
            Supprimer l&apos;événement
          </button>
        </form>
      </section>

      <section className="admin-card admin-section">
        <div className="admin-section-head">
          <h2>
            Réservations{" "}
            {eventReservations.length > 0 && (
              <span className="res-pending-badge" style={{ marginLeft: "0.5rem" }}>
                {eventReservations.length}
              </span>
            )}
          </h2>
          <Link
            className="button button-secondary"
            href={`/admin/reservations/groupe/event_${event.id}`}
          >
            Voir toutes →
          </Link>
        </div>
        {eventReservations.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Aucune réservation pour cet événement.
          </p>
        ) : (
          <div className="res-event-summary">
            {(["confirmed", "new", "reviewed", "contacted", "refused"] as const).map((status) => {
              const count = eventReservations.filter((r) => r.status === status).length;
              if (count === 0) return null;
              const labels: Record<string, string> = {
                confirmed: "Confirmées",
                new: "Nouvelles",
                reviewed: "Examinées",
                contacted: "Contactées",
                refused: "Refusées"
              };
              return (
                <span key={status} className={`res-event-stat res-status-${status}`}>
                  <strong>{count}</strong> {labels[status]}
                </span>
              );
            })}
          </div>
        )}
      </section>

      <section
        className="admin-card admin-section"
        data-testid={`photos-section-${event.slug}`}
      >
        <h2>Photos ({photos.length})</h2>

        {photos.length > 0 ? (
          <ul className="admin-photo-list">
            {photos.map((photo, index) => (
              <li
                key={photo.id}
                data-testid={`admin-photo-item-${event.slug}-${index}`}
                className="admin-photo-item"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.image_url} alt={photo.alt_fr} width={60} height={40} />
                <span className="admin-photo-url">{photo.image_url}</span>
                <form action={reorderPhotoAction} className="inline-form">
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="event_slug" value={event.slug} />
                  <label>
                    Ordre
                    <input name="sort_order" type="number" defaultValue={photo.order} />
                  </label>
                  <button type="submit" className="button-ghost">
                    Réordonner
                  </button>
                </form>
                <form action={deletePhotoAction}>
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="event_slug" value={event.slug} />
                  <button
                    type="submit"
                    data-testid={`delete-photo-${photo.id}`}
                    className="button-secondary"
                  >
                    Supprimer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p data-testid={`photos-empty-${event.slug}`}>Aucune photo pour cet événement.</p>
        )}

        <form
          action={addPhotoAction}
          data-testid={`add-photo-form-${event.slug}`}
          className="admin-form admin-form-compact"
        >
          <input type="hidden" name="event_id" value={event.id} />
          <input type="hidden" name="event_slug" value={event.slug} />
          <label>
            URL de la photo
            <input
              name="image_url"
              type="text"
              placeholder="/media/events/photo.png"
              aria-label={`URL photo ${event.slug}`}
              required
            />
          </label>
          <label>
            Légende FR
            <input name="alt_fr" aria-label={`Légende FR ${event.slug}`} />
          </label>
          <label>
            Légende EN
            <input name="alt_en" aria-label={`Légende EN ${event.slug}`} />
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
    </main>
  );
}
