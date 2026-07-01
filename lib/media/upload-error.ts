type ErrorLike = {
  code?: string | number;
  message?: string;
  errors?: Array<{ message?: string; reason?: string }>;
};

function asErrorLike(error: unknown): ErrorLike | null {
  if (typeof error !== "object" || error === null) return null;
  return error as ErrorLike;
}

export function formatMediaUploadError(error: unknown): string {
  const err = asErrorLike(error);
  const message = err?.message ?? (error instanceof Error ? error.message : "");
  const haystack = message.toLowerCase();

  if (
    haystack.includes("invalid_grant") ||
    haystack.includes("invalid jwt") ||
    haystack.includes("invalid_client") ||
    haystack.includes("error:0909006c") ||
    haystack.includes("decoder")
  ) {
    return (
      "Identifiants Firebase invalides. Vérifiez FIREBASE_CLIENT_EMAIL et " +
      "FIREBASE_PRIVATE_KEY (les sauts de ligne doivent être encodés en \\n)."
    );
  }

  if (haystack.includes("does not exist") || haystack.includes("notfound") || haystack.includes("404")) {
    return (
      "Bucket Firebase introuvable. Vérifiez FIREBASE_STORAGE_BUCKET " +
      "(ex. mon-projet.appspot.com ou mon-projet.firebasestorage.app)."
    );
  }

  if (
    haystack.includes("permission") ||
    haystack.includes("forbidden") ||
    haystack.includes("403") ||
    haystack.includes("does not have storage")
  ) {
    return (
      "Permission refusée sur le bucket Firebase. Le compte de service doit avoir " +
      "le rôle « Storage Admin » (ou « Storage Object Admin »)."
    );
  }

  if (message) {
    return message;
  }

  return "Échec de l'upload.";
}
