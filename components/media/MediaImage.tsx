"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState, type ImgHTMLAttributes } from "react";

type Status = "loading" | "loaded" | "error";
const FALLBACK = "/media/image-unavailable.svg";

function useImageStatus() {
  const [status, setStatus] = useState<Status>("loading");
  const ref = useCallback((image: HTMLImageElement | null) => {
    // Cached images may finish before hydration attaches onLoad.
    if (image?.complete) setStatus(image.naturalWidth > 0 ? "loaded" : "error");
  }, []);
  return { status, setStatus, ref };
}

type NativeProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & { src: string; alt: string };

export function MediaImage(props: NativeProps) {
  return <NativeImage key={props.src} {...props} />;
}

function NativeImage({ src, alt, loading = "lazy", decoding = "async", onLoad, onError, ...props }: NativeProps) {
  const { status, setStatus, ref } = useImageStatus();
  return (
    // Native images preserve tokenized remote URLs and the existing image sizing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props} ref={ref} src={status === "error" ? FALLBACK : src} alt={alt}
      loading={loading} decoding={decoding} data-media-state={status} data-media-src={src}
      aria-busy={status === "loading"}
      onLoad={event => { if (status !== "error") setStatus("loaded"); onLoad?.(event); }}
      onError={event => { setStatus("error"); onError?.(event); }}
    />
  );
}

export function OptimizedImage(props: ImageProps) {
  const source = typeof props.src === "string" ? props.src : "default" in props.src ? props.src.default.src : props.src.src;
  return <OptimizedImageContent key={source} {...props} />;
}

function OptimizedImageContent({ src, alt, onLoad, onError, ...props }: ImageProps) {
  const { status, setStatus, ref } = useImageStatus();
  return (
    <Image
      {...props} ref={ref} src={status === "error" ? FALLBACK : src} alt={alt}
      unoptimized={status === "error" || props.unoptimized}
      data-media-state={status} aria-busy={status === "loading"}
      onLoad={event => { if (status !== "error") setStatus("loaded"); onLoad?.(event); }}
      onError={event => { setStatus("error"); onError?.(event); }}
    />
  );
}
