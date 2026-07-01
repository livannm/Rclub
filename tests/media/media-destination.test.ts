import { describe, expect, it } from "vitest";
import {
  defaultDestinationForResourceType,
  mediaDestinationToPath,
  parseMediaDestinationFromForm
} from "@/lib/media/media-destination";

describe("mediaDestinationToPath", () => {
  it("maps known destinations to folder segments", () => {
    expect(mediaDestinationToPath({ kind: "images" })).toEqual(["images"]);
    expect(mediaDestinationToPath({ kind: "videos" })).toEqual(["videos"]);
    expect(mediaDestinationToPath({ kind: "events", eventSlug: "legend-r" })).toEqual([
      "events",
      "legend-r"
    ]);
  });

  it("defaults by resource type", () => {
    expect(defaultDestinationForResourceType("image")).toEqual({ kind: "images" });
    expect(defaultDestinationForResourceType("video")).toEqual({ kind: "videos" });
  });
});

describe("parseMediaDestinationFromForm", () => {
  it("parses images, videos and event destinations", () => {
    const imagesForm = new FormData();
    imagesForm.append("media_destination", "images");
    expect(parseMediaDestinationFromForm(imagesForm)).toEqual({ kind: "images" });

    const videosForm = new FormData();
    videosForm.append("media_destination", "videos");
    expect(parseMediaDestinationFromForm(videosForm)).toEqual({ kind: "videos" });

    const eventForm = new FormData();
    eventForm.append("media_destination", "events");
    eventForm.append("event_slug", "r-family");
    expect(parseMediaDestinationFromForm(eventForm)).toEqual({
      kind: "events",
      eventSlug: "r-family"
    });
  });

  it("returns null when event slug is missing", () => {
    const form = new FormData();
    form.append("media_destination", "events");
    expect(parseMediaDestinationFromForm(form)).toBeNull();
  });
});
