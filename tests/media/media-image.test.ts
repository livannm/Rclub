// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MediaImage } from "@/components/media/MediaImage";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("media loading feedback", () => {
  it("reserves a loading state until the image loads and defaults to lazy loading", () => {
    render(createElement(MediaImage, { src: "/photo.jpg", alt: "Affiche", width: 400, height: 300 }));
    const image = screen.getByRole("img", { name: "Affiche" });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("data-media-state", "loading");
    expect(image).toHaveAttribute("width", "400");
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-media-state", "loaded");
    expect(image).toHaveAttribute("aria-busy", "false");
  });

  it("replaces a broken image, stops the loader, and resets for the next source", () => {
    const onLoad = vi.fn();
    const view = render(createElement(MediaImage, { src: "/missing.jpg", alt: "Affiche", onLoad }));
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("data-media-state", "error");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/media/image-unavailable.svg");
    fireEvent.load(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("data-media-state", "error");
    expect(onLoad).toHaveBeenCalledOnce(); // The lightbox can also center the fallback image.
    view.rerender(createElement(MediaImage, { src: "/next.jpg", alt: "Affiche" }));
    expect(screen.getByRole("img")).toHaveAttribute("data-media-state", "loading");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/next.jpg");
  });

  it("recognizes images loaded from cache before hydration and respects eager loading", () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(400);
    render(createElement(MediaImage, { src: "/cached.jpg", alt: "Affiche", loading: "eager" }));
    expect(screen.getByRole("img")).toHaveAttribute("data-media-state", "loaded");
    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });
});
