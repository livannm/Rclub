"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { sendCancellationEmail, sendConfirmationEmail, sendRefusalEmail, sendUpdateEmail } from "@/lib/email/reservation-emails";
import { adminReservationSchema } from "@/lib/reservations/reservation-schema";
import { ZodError } from "zod";

const REVALIDATION_PATHS = ["/admin/reservations"] as const;

function revalidateReservationViews() {
  for (const path of REVALIDATION_PATHS) {
    revalidatePath(path, "layout");
  }
}

export async function confirmReservationAction(formData: FormData) {
  const id = formData.get("reservation_id");
  const adminNotes = formData.get("admin_notes");

  if (typeof id !== "string") return;

  const updated = await reservationService.confirm(
    id,
    typeof adminNotes === "string" ? adminNotes : undefined
  );

  try {
    await sendConfirmationEmail(updated);
  } catch (error) {
    // Email failure is non-blocking — reservation is still confirmed
    console.error("[reservations] échec de l'email de confirmation:", error);
  }

  revalidateReservationViews();
  redirect(`/admin/reservations/${id}?confirmed=1`);
}

export async function refuseReservationAction(formData: FormData) {
  const id = formData.get("reservation_id");
  const adminNotes = formData.get("admin_notes");

  if (typeof id !== "string") return;

  const updated = await reservationService.refuse(
    id,
    typeof adminNotes === "string" ? adminNotes : undefined
  );

  try {
    await sendRefusalEmail(updated);
  } catch (error) {
    // Email failure is non-blocking
    console.error("[reservations] échec de l'email de refus:", error);
  }

  revalidateReservationViews();
  redirect(`/admin/reservations/${id}?refused=1`);
}

export async function cancelReservationAction(formData: FormData) {
  const id = formData.get("reservation_id");
  const adminNotes = formData.get("admin_notes");
  const notify = formData.get("notify_client") === "on";

  if (typeof id !== "string") return;

  const updated = await reservationService.cancel(
    id,
    typeof adminNotes === "string" ? adminNotes : undefined
  );

  if (notify) {
    try {
      await sendCancellationEmail(updated);
    } catch (error) {
      // Email failure is non-blocking — reservation is still cancelled
      console.error("[reservations] échec de l'email d'annulation:", error);
    }
  }

  revalidateReservationViews();
  redirect(`/admin/reservations/${id}?cancelled=1`);
}

export async function createManualReservationAction(formData: FormData) {
  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    event_id: formData.get("event_id") || undefined,
    date_requested: formData.get("date_requested") || undefined,
    guest_count: formData.get("guest_count"),
    admin_notes: formData.get("admin_notes") || undefined
  };

  try {
    const payload = adminReservationSchema.parse(raw);
    const created = await reservationService.createByAdmin(payload);

    const notify = formData.get("notify_client") === "on";
    if (notify) {
      try {
        await sendConfirmationEmail(created);
      } catch (error) {
        // non-blocking
        console.error("[reservations] échec de l'email de confirmation (création):", error);
      }
    }

    revalidateReservationViews();
    redirect(`/admin/reservations/${created.id}?created=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      redirect(`/admin/reservations/new?message=${encodeURIComponent(error.issues[0]?.message ?? "Données invalides.")}`);
    }
    throw error;
  }
}

export async function updateReservationAction(formData: FormData) {
  const id = formData.get("reservation_id");
  if (typeof id !== "string") return;

  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    event_id: formData.get("event_id") || undefined,
    date_requested: formData.get("date_requested") || undefined,
    guest_count: formData.get("guest_count"),
    admin_notes: formData.get("admin_notes") || undefined
  };

  try {
    const payload = adminReservationSchema.parse(raw);
    const updated = await reservationService.update(id, payload);

    const notify = formData.get("notify_client") === "on";
    if (notify) {
      try {
        await sendUpdateEmail(updated);
      } catch (error) {
        // non-blocking
        console.error("[reservations] échec de l'email de mise à jour:", error);
      }
    }

    revalidateReservationViews();
    redirect(`/admin/reservations/${id}?saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      redirect(`/admin/reservations/${id}?message=${encodeURIComponent(error.issues[0]?.message ?? "Données invalides.")}`);
    }
    throw error;
  }
}
