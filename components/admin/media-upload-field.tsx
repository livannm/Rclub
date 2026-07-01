"use client";

import { useRef, useState } from "react";
import { appendMediaDestination, type MediaDestination } from "@/lib/media/media-destination";

type MediaKind = "image" | "video";

type UploadResponse = {
  url: string;
  provider: "firebase" | "local";
  resourceType: MediaKind;
};

type MediaUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  kind: MediaKind;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  /** Extra class applied to the wrapping label (e.g. `full-span`). */
  className?: string;
  ariaLabel?: string;
  /** Target folder in Firebase Storage / local uploads (images, videos, events/…). */
  destination?: MediaDestination;
};

const PROVIDER_LABEL: Record<UploadResponse["provider"], string> = {
  firebase: "Firebase Storage",
  local: "stockage local (dev)"
};

export function MediaUploadField({
  id,
  name,
  label,
  kind,
  defaultValue = "",
  required = false,
  placeholder,
  className,
  ariaLabel,
  destination
}: MediaUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [provider, setProvider] = useState<UploadResponse["provider"] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = kind === "video" ? "video/*" : "image/*";

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    if (destination) {
      appendMediaDestination(formData, destination);
    }

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData
    });
    const json = (await response.json()) as UploadResponse & { error?: string };

    if (!response.ok) {
      throw new Error(json.error ?? "Échec de l'upload.");
    }

    return json;
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setMessage(null);

    try {
      const json = await uploadFile(file);
      setValue(json.url);
      setProvider(json.provider);
      setStatus("done");
      setMessage(`Importé via ${PROVIDER_LABEL[json.provider]}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Échec de l'upload.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const showPreview = value.trim().length > 0;

  return (
    <>
      <label htmlFor={id} className={className}>
        {label}
        {required ? " *" : ""}
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          placeholder={placeholder}
          required={required}
          aria-label={ariaLabel}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="media-upload__row">
          <button
            type="button"
            className="button-secondary media-upload__btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "uploading"}
            data-testid={`media-upload-btn-${name}`}
          >
            {status === "uploading" ? "Import en cours…" : "Importer un fichier"}
          </button>
          {message ? (
            <span
              className={
                status === "error" ? "media-upload__msg is-error" : "media-upload__msg"
              }
              role={status === "error" ? "alert" : undefined}
            >
              {message}
            </span>
          ) : (
            <span className="media-upload__hint">ou collez une URL</span>
          )}
        </div>
        {showPreview ? (
          <div className="media-upload__preview" data-provider={provider ?? "url"}>
            {kind === "video" ? (
              <video src={value} className="media-upload__media" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Aperçu" className="media-upload__media" />
            )}
          </div>
        ) : null}
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleFile}
        data-testid={`media-upload-input-${name}`}
      />
    </>
  );
}
