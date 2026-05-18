"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eventPayloadFromFormData } from "@/lib/events/event-form";
import { EventServiceError } from "@/lib/events/events-service";
import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";

const EVENT_REVALIDATION_PATHS = ["/admin/events", "/agenda", "/"] as const;

function revalidateEventViews(slug?: string) {
  for (const path of EVENT_REVALIDATION_PATHS) {
    revalidatePath(path, "layout");
  }

  if (slug) {
    revalidatePath(`/agenda/${slug}`);
    revalidatePath(`/galerie/${slug}`);
  }
}

function revalidateGalleryViews(slug: string) {
  revalidatePath("/galerie", "layout");
  revalidatePath(`/galerie/${slug}`);
}

function redirectAfterEventActionError(error: unknown, returnTo: string): never {
  if (error instanceof EventServiceError) {
    redirect(`${returnTo}?message=${encodeURIComponent(error.message)}`);
  }

  throw error;
}

export async function createEventAction(formData: FormData) {
  try {
    const payload = eventPayloadFromFormData(formData);
    const created = await eventService.create(payload);
    revalidateEventViews(created.slug);
    redirect(`/admin/events/${created.id}/edit?created=1`);
  } catch (error) {
    redirectAfterEventActionError(error, "/admin/events/new");
  }
}

export async function updateEventAction(formData: FormData) {
  const eventId = formData.get("event_id");
  if (typeof eventId !== "string") {
    return;
  }

  try {
    const payload = eventPayloadFromFormData(formData);
    const updated = await eventService.update(eventId, payload);
    revalidateEventViews(updated.slug);
    redirect(`/admin/events/${eventId}/edit?saved=1`);
  } catch (error) {
    redirectAfterEventActionError(error, `/admin/events/${eventId}/edit`);
  }
}

export async function deleteEventAction(formData: FormData) {
  const eventId = formData.get("event_id");
  if (typeof eventId !== "string") {
    return;
  }

  const existing = await eventService.findById(eventId);

  try {
    await eventService.delete(eventId);
    revalidateEventViews(existing?.slug);
    redirect("/admin/events?deleted=1");
  } catch (error) {
    redirectAfterEventActionError(error, `/admin/events/${eventId}/edit`);
  }
}

export async function addPhotoAction(formData: FormData) {
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
    redirect(
      `/admin/events/${eventId}/edit?message=${encodeURIComponent("URL de la photo requise.")}`
    );
  }

  const sortOrder = sortOrderRaw ? parseInt(String(sortOrderRaw), 10) : 0;

  await galleryService.addPhoto({
    event_id: eventId,
    event_slug: eventSlug,
    image_url: imageUrl,
    alt_fr: typeof altFr === "string" ? altFr : "",
    alt_en: typeof altEn === "string" ? altEn : "",
    order: Number.isNaN(sortOrder) ? 0 : sortOrder
  });

  revalidateGalleryViews(eventSlug);
  redirect(`/admin/events/${eventId}/edit?photoAdded=1`);
}

export async function deletePhotoAction(formData: FormData) {
  const photoId = formData.get("photo_id");
  const eventId = formData.get("event_id");
  const eventSlug = formData.get("event_slug");

  if (typeof photoId !== "string" || typeof eventSlug !== "string" || typeof eventId !== "string") {
    return;
  }

  await galleryService.deletePhoto(photoId);
  revalidateGalleryViews(eventSlug);
  redirect(`/admin/events/${eventId}/edit?photoDeleted=1`);
}

export async function reorderPhotoAction(formData: FormData) {
  const photoId = formData.get("photo_id");
  const sortOrderRaw = formData.get("sort_order");
  const eventId = formData.get("event_id");
  const eventSlug = formData.get("event_slug");

  if (typeof photoId !== "string" || typeof eventSlug !== "string" || typeof eventId !== "string") {
    return;
  }

  const sortOrder = parseInt(String(sortOrderRaw), 10);
  if (Number.isNaN(sortOrder)) {
    return;
  }

  await galleryService.reorderPhoto(photoId, sortOrder);
  revalidateGalleryViews(eventSlug);
  redirect(`/admin/events/${eventId}/edit?photoReordered=1`);
}
