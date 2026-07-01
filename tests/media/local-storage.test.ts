import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocalMediaStorage } from "@/lib/media/local-storage";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rclub-media-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("LocalMediaStorage", () => {
  it("writes nested folders when a folder path is provided", async () => {
    const storage = new LocalMediaStorage({ uploadDir: dir, publicBase: "/media/uploads" });
    const data = Buffer.from("event-shot");

    const result = await storage.upload({
      data,
      filename: "gallery.png",
      contentType: "image/png",
      folderPath: ["events", "legend-r"]
    });

    expect(result.url.startsWith("/media/uploads/events/legend-r/")).toBe(true);
    expect(result.url).toMatch(/gallery\.png$/);

    const relativePath = result.url.replace("/media/uploads/", "");
    const written = await readFile(path.join(dir, relativePath));
    expect(written.equals(data)).toBe(true);
  });

  it("writes the file and returns a public URL under the configured base", async () => {
    const storage = new LocalMediaStorage({ uploadDir: dir, publicBase: "/media/uploads" });
    const data = Buffer.from("hello-image");

    const result = await storage.upload({
      data,
      filename: "My Cover Photo.PNG",
      contentType: "image/png"
    });

    expect(result.provider).toBe("local");
    expect(result.resourceType).toBe("image");
    expect(result.bytes).toBe(data.byteLength);
    expect(result.url.startsWith("/media/uploads/")).toBe(true);
    // filename is sanitized to lowercase, safe characters
    expect(result.url).toMatch(/my-cover-photo\.png$/);

    const written = await readFile(path.join(dir, path.basename(result.url)));
    expect(written.equals(data)).toBe(true);
  });

  it("classifies videos correctly", async () => {
    const storage = new LocalMediaStorage({ uploadDir: dir });
    const result = await storage.upload({
      data: Buffer.from("clip"),
      filename: "promo.mp4",
      contentType: "video/mp4"
    });
    expect(result.resourceType).toBe("video");
  });

  it("generates unique names for identical filenames", async () => {
    const storage = new LocalMediaStorage({ uploadDir: dir });
    const a = await storage.upload({
      data: Buffer.from("a"),
      filename: "same.png",
      contentType: "image/png"
    });
    const b = await storage.upload({
      data: Buffer.from("b"),
      filename: "same.png",
      contentType: "image/png"
    });
    expect(a.url).not.toBe(b.url);
  });
});
