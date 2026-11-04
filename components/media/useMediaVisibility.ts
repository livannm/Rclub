"use client";

import { useEffect, useRef, useState } from "react";

export function useMediaVisibility(eager = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);
  useEffect(() => {
    if (visible || !ref.current) return;
    if (!("IntersectionObserver" in window)) {
      // Older browsers still get a usable player.
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);
  return { ref, visible };
}
