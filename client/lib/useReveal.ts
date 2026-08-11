"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Track whether an element has entered the viewport for scroll-reveal UI.
 *
 * Once visible, observation stops so the element stays revealed. When
 * `IntersectionObserver` is unavailable, the element is treated as visible.
 *
 * @param options - Observer threshold and root margin.
 * @param options.threshold - Intersection ratio required to reveal (default
 *     0.15).
 * @param options.rootMargin - Observer root margin (default bottom inset).
 * @returns Ref to attach to the target element and current visibility flag.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
