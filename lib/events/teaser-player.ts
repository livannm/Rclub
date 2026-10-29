export type TeaserPlayer =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string };

const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

function youtubeEmbedSrc(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (!YOUTUBE_HOSTS.has(host)) {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const watchId = url.searchParams.get("v");
  if ((parts.length === 0 || parts[0] === "watch") && watchId && YOUTUBE_ID.test(watchId)) {
    return `https://www.youtube-nocookie.com/embed/${watchId}`;
  }

  const marker = parts[0];
  const id = parts[1];
  if ((marker === "embed" || marker === "shorts" || marker === "live") && id && YOUTUBE_ID.test(id)) {
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }

  return null;
}

function isCloudStorageHost(hostname: string) {
  const host = hostname.replace(/^www\./, "");
  return (
    host === "firebasestorage.googleapis.com" ||
    host.endsWith(".firebasestorage.app") ||
    host === "storage.googleapis.com" ||
    host === "storage.cloud.google.com"
  );
}

/**
 * Firebase and Cloud Storage object URLs are the same kind of link as event photos.
 * The download API returns JSON unless `alt=media` is set, which a video element cannot play.
 * The original string is kept so encoded paths (`events%2Fslug%2Ffile.mp4`) and tokens stay intact.
 */
function cloudFileSrc(raw: string, url: URL): string | null {
  if (!isCloudStorageHost(url.hostname)) {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const isDownloadApi =
    host === "firebasestorage.googleapis.com" ||
    host.endsWith(".firebasestorage.app") ||
    (host === "storage.googleapis.com" && url.pathname.includes("/o/"));

  if (!isDownloadApi || /[?&]alt=media(?:&|$)/.test(raw)) {
    return raw;
  }

  return raw.includes("?") ? `${raw}&alt=media` : `${raw}?alt=media`;
}

function vimeoEmbedSrc(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "player.vimeo.com" && parts[0] === "video" && parts[1] && /^\d+$/.test(parts[1])) {
    return `https://player.vimeo.com/video/${parts[1]}?dnt=1`;
  }

  if (host === "vimeo.com" && parts[0] && /^\d+$/.test(parts[0])) {
    const hash = parts[1] && /^[a-zA-Z0-9]+$/.test(parts[1]) ? parts[1] : undefined;
    const src = new URL(`https://player.vimeo.com/video/${parts[0]}`);
    src.searchParams.set("dnt", "1");
    if (hash) {
      src.searchParams.set("h", hash);
    }
    return src.toString();
  }

  return null;
}

/** Turns an admin-provided teaser link into a player source. Empty values render nothing. */
export function resolveTeaserPlayer(value: string | null | undefined): TeaserPlayer | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed, "https://rclub.local");
    const embed = youtubeEmbedSrc(url) ?? vimeoEmbedSrc(url);
    if (embed) {
      return { kind: "embed", src: embed };
    }

    const cloud = cloudFileSrc(trimmed, url);
    if (cloud) {
      return { kind: "file", src: cloud };
    }
  } catch {
    return { kind: "file", src: trimmed };
  }

  return { kind: "file", src: trimmed };
}
