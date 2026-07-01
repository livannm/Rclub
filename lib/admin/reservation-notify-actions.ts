"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import {
  ReservationNotifyServiceError,
  ReservationNotifyService
} from "@/lib/reservation-notify/reservation-notify-service";
import { reservationNotifyService } from "@/lib/reservation-notify/reservation-notify-service-instance";

const NOTIFICATIONS_PATH = "/admin/reservations/notifications";

function redirectWithMessage(message: string, type: "error" | "success" = "error") {
  const param = type === "success" ? "added" : "message";
  redirect(`${NOTIFICATIONS_PATH}?${param}=${encodeURIComponent(message)}`);
}

async function runWithAuth<T>(action: (service: ReservationNotifyService) => Promise<T>) {
  await requireAdminSession();
  return action(reservationNotifyService);
}

export async function addReservationNotifyEmailAction(formData: FormData) {
  const email = formData.get("email");

  try {
    await runWithAuth((service) => {
      if (typeof email !== "string" || !email.trim()) {
        throw new ReservationNotifyServiceError("L'adresse email est requise.");
      }
      return service.addEmail(email);
    });
  } catch (error) {
    const message =
      error instanceof ReservationNotifyServiceError
        ? error.message
        : "Impossible d'ajouter l'adresse.";
    redirectWithMessage(message);
  }

  revalidatePath(NOTIFICATIONS_PATH);
  redirect(`${NOTIFICATIONS_PATH}?added=1`);
}

export async function removeReservationNotifyEmailAction(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    redirectWithMessage("Adresse invalide.");
    return;
  }

  try {
    await runWithAuth((service) => service.removeEmail(email));
  } catch {
    redirectWithMessage("Impossible de retirer l'adresse.");
  }

  revalidatePath(NOTIFICATIONS_PATH);
  redirect(`${NOTIFICATIONS_PATH}?removed=1`);
}
