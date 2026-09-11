"use client";

import { useState, useEffect, useId } from "react";
import { Menu, X } from "react-feather";
import { HERO, NAV_ITEMS } from "../../constants/config";

const NAV_OFFSET_PX = 96;

/** Builds nav pill classes for the active vs inactive state. */
const navPillClass = (active: boolean) =>
  `min-h-[44px] px-4 py-2 text-sm font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
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
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]?.id ?? "about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      let current = NAV_ITEMS[0]?.id ?? "about";
      for (const { id, external } of NAV_ITEMS) {
        if (external) continue;
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

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.external && item.href) {
      setMobileMenuOpen(false);
      window.location.assign(item.href);
      return;
    }
    setActiveSection(item.id);
    setMobileMenuOpen(false);
    scrollToSection(item.id);
  };

  return (
    <nav
      aria-label="Main"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a
          href="#about"
          className="min-h-[44px] flex flex-col justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="text-nav font-medium text-ink leading-tight">
            {HERO.name}
          </span>
          <span className="text-xs text-ink-muted leading-tight">
            {HERO.role}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              aria-current={!item.external && activeSection === item.id ? "true" : undefined}
              className={navPillClass(!item.external && activeSection === item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden text-ink min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls={menuId}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id={menuId}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/5 px-6 py-6 flex flex-col gap-2"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              aria-current={!item.external && activeSection === item.id ? "true" : undefined}
              className={`text-left ${navPillClass(!item.external && activeSection === item.id)}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
