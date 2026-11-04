"use client";

import { useState, type IframeHTMLAttributes, type VideoHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { useMediaVisibility } from "@/components/media/useMediaVisibility";

function MediaStatus({ error = false }: { error?: boolean }) {
  const t = useTranslations("Media");
  return <span className={`media-status${error ? " media-status--error" : ""}`} role="status">
    {!error && <span className="media-status-line" aria-hidden="true" />}
    <span>{t(error ? "unavailable" : "loading")}</span>
  </span>;
}

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & { src: string; eager?: boolean; "data-testid"?: string };

export function MediaVideo(props: VideoProps) {
  return <VideoPlayer key={props.src} {...props} />;
}

function VideoPlayer({ eager = false, className = "", preload = "metadata", onLoadedData, onLoadedMetadata, onError, ...props }: VideoProps) {
  const { ref, visible } = useMediaVisibility(eager);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return <div ref={ref} className={`media-player ${className}`} data-media-state={status} aria-busy={status === "loading"}>
    {visible && <video
      {...props} preload={preload}
      onLoadedMetadata={event => { if (!props.autoPlay) setStatus("loaded"); onLoadedMetadata?.(event); }}
      onLoadedData={event => { setStatus("loaded"); onLoadedData?.(event); }}
      onError={event => { setStatus("error"); onError?.(event); }}
    />}
    {status !== "loaded" && <MediaStatus error={status === "error"} />}
  </div>;
}

type EmbedProps = IframeHTMLAttributes<HTMLIFrameElement> & { src: string };

export function MediaEmbed(props: EmbedProps) {
  return <EmbedPlayer key={props.src} {...props} />;
}

function EmbedPlayer({ className = "", onLoad, onError, ...props }: EmbedProps) {
  const { ref, visible } = useMediaVisibility();
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return <div ref={ref} className={`media-player media-player--embed ${className}`} data-media-state={status} aria-busy={status === "loading"}>
    {visible && <iframe {...props}
      onLoad={event => { setStatus("loaded"); onLoad?.(event); }}
      onError={event => { setStatus("error"); onError?.(event); }}
    />}
    {status !== "loaded" && <MediaStatus error={status === "error"} />}
  </div>;
}
