export type MediaDestination =
  | { kind: "images" }
  | { kind: "videos" }
  | { kind: "events"; eventSlug: string };

export function mediaDestinationToPath(destination: MediaDestination): string[] {
  switch (destination.kind) {
    case "images":
      return ["images"];
    case "videos":
      return ["videos"];
    case "events":
      return ["events", destination.eventSlug];
  }
}

export function defaultDestinationForResourceType(
  resourceType: "image" | "video"
): MediaDestination {
  return resourceType === "video" ? { kind: "videos" } : { kind: "images" };
}

export function parseMediaDestinationFromForm(formData: FormData): MediaDestination | null {
  const kind = formData.get("media_destination");
  if (kind === "images") return { kind: "images" };
  if (kind === "videos") return { kind: "videos" };
  if (kind === "events") {
    const eventSlug = formData.get("event_slug");
    if (typeof eventSlug === "string" && eventSlug.trim()) {
      return { kind: "events", eventSlug: eventSlug.trim() };
    }
  }
  return null;
}

export function appendMediaDestination(formData: FormData, destination: MediaDestination) {
  formData.append("media_destination", destination.kind);
  if (destination.kind === "events") {
    formData.append("event_slug", destination.eventSlug);
  }
}
