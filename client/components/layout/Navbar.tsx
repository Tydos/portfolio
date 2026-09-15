"use client";

import { useState, useEffect, useId } from "react";
import { Menu, X } from "react-feather";
import { NAV_ITEMS, RESUME_URL } from "../../constants/config";

const resumeButtonClassName =
  "inline-flex items-center justify-center min-h-[36px] px-3 py-1 text-xs font-medium rounded-full text-ink-muted hover:text-ink hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors shrink-0";

/** Slightly past the 4.5rem `scroll-mt` sections land on, so the section a
 * nav click targets reliably reads as active once the scroll settles. */
const NAV_OFFSET_PX = 80;

/** Builds nav pill classes for the active vs inactive state. */
const navPillClass = (active: boolean) =>
  `min-h-[36px] px-3 py-1 text-xs font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    active
      ? "bg-ink text-white"
      : "text-ink-muted hover:text-ink hover:bg-slate-100"
  }`;

/** Smooth-scrolls to a section id, respecting reduced-motion preferences. */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
}

/** Sticky top navigation with section highlighting and mobile menu. */
function Navbar() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]?.id ?? "resume");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      let current = NAV_ITEMS[0]?.id ?? "resume";
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_OFFSET_PX) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav
      aria-label="Main"
      className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-black/5 shadow-sm"
          : "bg-white/70 backdrop-blur-sm border-black/[0.04]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center gap-2">
        <a
          href="#resume"
          className="min-w-0 text-sm font-semibold text-ink truncate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
        >
          Prasad Jawale
        </a>

        <div className="hidden md:flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
                aria-current={activeSection === id ? "true" : undefined}
                className={navPillClass(activeSection === id)}
              >
                {label}
              </button>
            ))}
          </div>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={resumeButtonClassName}
          >
            Résumé
            <span className="sr-only"> (PDF, opens in new tab)</span>
          </a>
        </div>

        <div className="flex md:hidden shrink-0 items-center gap-1">
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={resumeButtonClassName}
          >
            Résumé
            <span className="sr-only"> (PDF, opens in new tab)</span>
          </a>
          <button
            type="button"
            className="text-ink min-h-[44px] min-w-[44px] -mr-3 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls={menuId}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id={menuId}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/5 px-4 sm:px-6 py-4 flex flex-col gap-1.5"
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavClick(id)}
              aria-current={activeSection === id ? "true" : undefined}
              className={`text-left ${navPillClass(activeSection === id)}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
