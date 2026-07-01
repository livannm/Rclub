"use client";

import { useRef, useState } from "react";
import { uploadMediaFromClient } from "@/lib/media/upload-from-client";
import { addPhotosAction } from "@/lib/admin/event-actions";

type EventPhotosBulkUploadProps = {
  eventId: string;
  eventSlug: string;
  nextSortOrder: number;
};

type UploadStatus = "idle" | "uploading" | "saving" | "done" | "error";

export function EventPhotosBulkUpload({
  eventId,
  eventSlug,
  nextSortOrder
}: EventPhotosBulkUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [altFr, setAltFr] = useState("");
  const [altEn, setAltEn] = useState("");

  async function uploadFile(file: File): Promise<string> {
    const result = await uploadMediaFromClient(file, { kind: "events", eventSlug });
    return result.url;
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setStatus("uploading");
    setMessage(null);
    setProgress({ current: 0, total: files.length });

    const urls: string[] = [];

    try {
      for (let index = 0; index < files.length; index++) {
        const url = await uploadFile(files[index]!);
        urls.push(url);
        setProgress({ current: index + 1, total: files.length });
      }

      setStatus("saving");

      const saveForm = new FormData();
      saveForm.append("event_id", eventId);
      saveForm.append("event_slug", eventSlug);
      saveForm.append("start_sort_order", String(nextSortOrder));
      saveForm.append("alt_fr", altFr);
      saveForm.append("alt_en", altEn);
      for (const url of urls) {
        saveForm.append("image_url", url);
      }

      await addPhotosAction(saveForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Échec de l'import des photos.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isBusy = status === "uploading" || status === "saving";

  return (
    <div
      className="admin-form admin-form-compact event-photos-bulk"
      data-testid={`add-photos-bulk-${eventSlug}`}
    >
      <p className="event-photos-bulk__hint">
        Sélectionnez plusieurs images — elles seront rangées dans Drive sous{" "}
        <code>events/{eventSlug}/</code>.
      </p>

      <label>
        Légende FR (optionnelle, appliquée à toutes)
        <input
          value={altFr}
          onChange={(event) => setAltFr(event.target.value)}
          aria-label={`Légende FR ${eventSlug}`}
          disabled={isBusy}
        />
      </label>
      <label>
        Légende EN (optionnelle, appliquée à toutes)
        <input
          value={altEn}
          onChange={(event) => setAltEn(event.target.value)}
          aria-label={`Légende EN ${eventSlug}`}
          disabled={isBusy}
        />
      </label>

      <div className="media-upload__row">
        <button
          type="button"
          className="button-secondary media-upload__btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          data-testid={`add-photos-bulk-btn-${eventSlug}`}
        >
          {status === "uploading"
            ? `Import ${progress.current}/${progress.total}…`
            : status === "saving"
              ? "Enregistrement…"
              : "Importer plusieurs photos"}
        </button>
        {message ? (
          <span className="media-upload__msg is-error" role="alert">
            {message}
          </span>
        ) : status === "uploading" ? (
          <span className="media-upload__msg">
            {progress.current}/{progress.total} fichier
            {progress.total > 1 ? "s" : ""} importé
            {progress.current > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="media-upload__hint">JPG, PNG, WebP, GIF, AVIF</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFiles}
        data-testid={`add-photos-bulk-input-${eventSlug}`}
      />
    </div>
  );
}
