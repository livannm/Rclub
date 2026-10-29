import { resolveTeaserPlayer } from "@/lib/events/teaser-player";

type EventTeaserPlayerProps = {
  url: string;
  title: string;
  caption?: string;
  className?: string;
};

export function EventTeaserPlayer({ url, title, caption, className }: EventTeaserPlayerProps) {
  const player = resolveTeaserPlayer(url);
  if (!player) {
    return null;
  }

  const rootClass = className ? `event-teaser ${className}` : "event-teaser";

  return (
    <figure className={rootClass} data-testid="event-teaser">
      {caption ? <figcaption className="event-teaser-caption">{caption}</figcaption> : null}
      <div className="event-teaser-frame">
        {player.kind === "embed" ? (
          <iframe
            src={player.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video src={player.src} controls playsInline preload="metadata" aria-label={title} />
        )}
      </div>
    </figure>
  );
}
