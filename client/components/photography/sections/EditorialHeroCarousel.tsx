"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "react-feather";
import {
  PORTFOLIO_HERO,
  PORTFOLIO_HERO_SLIDES,
} from "../../../constants/portfolioHero";
import { fetchHeroNaturePhotos } from "../../../lib/photos";
import {
  buildHeroSlides,
  getNextIndex,
  getPrevIndex,
} from "../../../lib/heroSlides";
import type { HeroSlide } from "../../../lib/heroSlides";

const AUTO_ADVANCE_MS = 5000;

export type EditorialHeroSize = "page" | "teaser";

export interface EditorialHeroCarouselProps {
  /** Page-filling hero on `/portfolio` or a shorter home teaser. */
  size?: EditorialHeroSize;
  /** Primary call-to-action (e.g. gallery anchor or portfolio route). */
  cta: ReactNode;
  /** Optional root section id (portfolio page uses `top`). */
  sectionId?: string;
  className?: string;
}

const sizeClasses: Record<
  EditorialHeroSize,
  { section: string; inner: string }
> = {
  page: {
    section: "min-h-[70vh] md:min-h-[80vh]",
    inner:
      "pt-32 md:pt-40 pb-16 md:pb-24 min-h-[70vh] md:min-h-[80vh]",
  },
  teaser: {
    section: "min-h-[55vh] md:min-h-[62vh] rounded-2xl",
    inner: "pt-12 md:pt-16 pb-12 md:pb-16 min-h-[55vh] md:min-h-[62vh]",
  },
};

/**
 * Wired editorial hero carousel shared by the portfolio page and home teaser.
 *
 * @param props.size - Layout profile (`page` or `teaser`).
 * @param props.cta - Call-to-action control rendered below the title.
 * @param props.sectionId - Optional section element id.
 * @param props.className - Extra classes on the section root.
 */
export default function EditorialHeroCarousel({
  size = "page",
  cta,
  sectionId,
  className = "",
}: EditorialHeroCarouselProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isHoveredRef = useRef(false);
  const layout = sizeClasses[size];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const photos = await fetchHeroNaturePhotos();
        if (!cancelled) {
          setSlides(buildHeroSlides(photos, [...PORTFOLIO_HERO_SLIDES]));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const goNext = useCallback(
    () => setIndex((i) => getNextIndex(i, slides.length)),
    [slides.length],
  );

  const goPrev = useCallback(
    () => setIndex((i) => getPrevIndex(i, slides.length)),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, slides.length]);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      if (isHoveredRef.current) return;

      const hasFocus =
        sectionRef.current?.contains(document.activeElement) ?? false;
      if (hasFocus) return;

      goNext();
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [goNext, index, prefersReducedMotion, slides.length]);

  const current = slides[index];
  const title = current?.title ?? PORTFOLIO_HERO.title;
  const total = slides.length;
  const motionClass = prefersReducedMotion ? "transition-none" : "";

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className={`relative ${layout.section} bg-wired-black text-wired-paper overflow-hidden border-b border-wired-black ${className}`}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.id ?? slide.src}
          src={slide.src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-70" : "opacity-0"
          } ${motionClass}`}
          aria-hidden="true"
        />
      ))}

      {loading && (
        <div
          className="absolute inset-0 bg-wired-black animate-pulse"
          aria-hidden="true"
        />
      )}

      <span
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-end ${layout.inner}`}
      >
        <div aria-live="polite" aria-atomic="true">
          {size === "page" ? (
            <>
              <h1 className="sr-only">Photography</h1>
              <p
                className="font-display uppercase tracking-wired text-[clamp(4rem,14vw,12rem)] leading-[0.85] text-white text-balance"
                aria-hidden="true"
              >
                {title}
              </p>
            </>
          ) : (
            <h2
              className="font-display uppercase tracking-wired text-[clamp(2.75rem,10vw,7rem)] leading-[0.85] text-white text-balance"
            >
              {title}
            </h2>
          )}
        </div>

        <span
          className="block mt-6 h-2 w-24 md:w-32 bg-wired-yellow"
          aria-hidden="true"
        />

        <div className="flex flex-wrap items-center gap-4 mt-10">
          {cta}

          {!loading && total > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="flex items-center justify-center min-h-[44px] min-w-[44px] bg-black/50 text-white hover:bg-wired-yellow hover:text-wired-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              <p className="text-sm font-bold tabular-nums tracking-wide text-white">
                <span className="inline-block bg-wired-yellow px-1.5 py-0.5 text-wired-black">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {" / "}
                {String(total).padStart(2, "0")}
              </p>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="flex items-center justify-center min-h-[44px] min-w-[44px] bg-black/50 text-white hover:bg-wired-yellow hover:text-wired-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
