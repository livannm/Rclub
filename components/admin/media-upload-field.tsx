"use client";

import { useRef, useState } from "react";

type MediaKind = "image" | "video";

type UploadResponse = {
  url: string;
  provider: "cloudinary" | "local";
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
};

const PROVIDER_LABEL: Record<UploadResponse["provider"], string> = {
  cloudinary: "Cloudinary",
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
  ariaLabel
}: MediaUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [provider, setProvider] = useState<UploadResponse["provider"] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = kind === "video" ? "video/*" : "image/*";

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData
      });
      const json = (await response.json()) as UploadResponse & { error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? "Échec de l'upload.");
      }

      setValue(json.url);
      setProvider(json.provider);
      setStatus("done");
      setMessage(`Importé via ${PROVIDER_LABEL[json.provider]}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Échec de l'upload.");
    } finally {
      // Allow re-uploading the same file.
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
