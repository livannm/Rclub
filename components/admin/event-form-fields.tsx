import type { ClubEvent } from "@/lib/events/event-schema";

type EventFormFieldsProps = {
  event?: ClubEvent;
  defaultStartsAt?: string;
  defaultEndsAt?: string;
};

function toDatetimeLocalValue(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

export function EventFormFields({ event, defaultStartsAt, defaultEndsAt }: EventFormFieldsProps) {
  const startsAtValue = event
    ? toDatetimeLocalValue(event.starts_at)
    : defaultStartsAt ?? "";
  const endsAtValue = event
    ? event.ends_at
      ? toDatetimeLocalValue(event.ends_at)
      : ""
    : defaultEndsAt ?? "";

  return (
    <div className="admin-form admin-form-compact form-grid two-column">
      <label htmlFor="slug">
        Slug
        <input id="slug" name="slug" defaultValue={event?.slug} required />
      </label>
      <label htmlFor="location">
        Lieu
        <input
          id="location"
          name="location"
          defaultValue={event?.location ?? "Rclub Strasbourg"}
          required
        />
      </label>
      <label htmlFor="title_fr">
        Titre (FR)
        <input id="title_fr" name="title_fr" defaultValue={event?.title_fr} required />
      </label>
      <label htmlFor="title_en">
        Titre (EN)
        <input id="title_en" name="title_en" defaultValue={event?.title_en} required />
      </label>
      <label htmlFor="description_fr" className="full-span">
        Description (FR)
        <textarea
          id="description_fr"
          name="description_fr"
          defaultValue={event?.description_fr}
          required
        />
      </label>
      <label htmlFor="description_en" className="full-span">
        Description (EN)
        <textarea
          id="description_en"
          name="description_en"
          defaultValue={event?.description_en}
          required
        />
      </label>
      <label htmlFor="starts_at">
        Début
        <input
          id="starts_at"
          name="starts_at"
          type="datetime-local"
          defaultValue={startsAtValue}
          required
        />
      </label>
      <label htmlFor="ends_at">
        Fin
        <input id="ends_at" name="ends_at" type="datetime-local" defaultValue={endsAtValue} />
      </label>
      <label htmlFor="cover_image_url" className="full-span">
        Image de couverture
        <input
          id="cover_image_url"
          name="cover_image_url"
          type="text"
          placeholder="/media/events/mon-event.png"
          defaultValue={event?.cover_image_url}
          required
        />
      </label>
      <label htmlFor="hero_video_url">
        Vidéo hero (optionnel)
        <input
          id="hero_video_url"
          name="hero_video_url"
          type="text"
          placeholder="/media/hero.mp4"
          defaultValue={event?.hero_video_url ?? ""}
        />
      </label>
      <label htmlFor="ticket_url">
        Billetterie (optionnel)
        <input
          id="ticket_url"
          name="ticket_url"
          type="text"
          placeholder="https://..."
          defaultValue={event?.ticket_url ?? ""}
        />
      </label>
      <label htmlFor="is_published" className="checkbox-label full-span">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          defaultChecked={event?.is_published ?? false}
        />
        Publier sur l&apos;agenda
      </label>
    </div>
  );
}
