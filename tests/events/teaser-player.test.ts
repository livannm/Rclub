import { describe, expect, it } from "vitest";
import { resolveTeaserPlayer } from "@/lib/events/teaser-player";

describe("resolveTeaserPlayer", () => {
  it("returns null when no video is set", () => {
    expect(resolveTeaserPlayer(undefined)).toBeNull();
    expect(resolveTeaserPlayer("")).toBeNull();
    expect(resolveTeaserPlayer("   ")).toBeNull();
  });

  it("embeds youtube watch, short and youtu.be links", () => {
    expect(resolveTeaserPlayer("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
      kind: "embed",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    });
    expect(resolveTeaserPlayer("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      kind: "embed",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    });
    expect(resolveTeaserPlayer("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toEqual({
      kind: "embed",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    });
  });

  it("embeds vimeo links, including an unlisted hash", () => {
    expect(resolveTeaserPlayer("https://vimeo.com/123456789")).toEqual({
      kind: "embed",
      src: "https://player.vimeo.com/video/123456789?dnt=1",
    });
    expect(resolveTeaserPlayer("https://vimeo.com/123456789/abc123")).toEqual({
      kind: "embed",
      src: "https://player.vimeo.com/video/123456789?dnt=1&h=abc123",
    });
  });

  it("plays firebase and cloud storage links like event photos", () => {
    const downloadUrl =
      "https://firebasestorage.googleapis.com/v0/b/rclub.appspot.com/o/events%2Flegend-r%2Fteaser.mp4?alt=media&token=abc-123";
    expect(resolveTeaserPlayer(downloadUrl)).toEqual({ kind: "file", src: downloadUrl });

    const objectUrl =
      "https://firebasestorage.googleapis.com/v0/b/rclub.firebasestorage.app/o/events%2Flegend-r%2Fteaser.mp4";
    expect(resolveTeaserPlayer(objectUrl)).toEqual({
      kind: "file",
      src: `${objectUrl}?alt=media`,
    });

    const publicObject = "https://storage.googleapis.com/rclub.appspot.com/events/legend-r/teaser.mp4";
    expect(resolveTeaserPlayer(publicObject)).toEqual({ kind: "file", src: publicObject });
  });

  it("plays a direct file url or local path in the native player", () => {
    expect(resolveTeaserPlayer("https://cdn.example.com/teasers/night.mp4")).toEqual({
      kind: "file",
      src: "https://cdn.example.com/teasers/night.mp4",
    });
    expect(resolveTeaserPlayer("/media/hero.mp4")).toEqual({
      kind: "file",
      src: "/media/hero.mp4",
    });
  });
});
