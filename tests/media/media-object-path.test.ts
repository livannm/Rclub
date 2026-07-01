import { describe, expect, it } from "vitest";
import {
  buildMediaObjectPath,
  sanitizeMediaFilename,
} from "@/lib/media/media-object-path";

describe("media-object-path", () => {
  it("sanitizes unsafe filenames", () => {
    expect(sanitizeMediaFilename("../../Hero Photo.PNG")).toBe("hero-photo.png");
  });

  it("builds a unique object path under the folder", () => {
    const objectPath = buildMediaObjectPath(["events", "legend-r"], "cover.jpg");
    expect(objectPath.startsWith("events/legend-r/")).toBe(true);
    expect(objectPath.endsWith("-cover.jpg")).toBe(true);
  });
});
