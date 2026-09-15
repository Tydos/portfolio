"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "react-feather";
import { NAV_ITEMS, RESUME_URL } from "../../constants/config";
import { isNavItemActive, navItemHref } from "../../lib/nav";
import type { NavItem } from "../../types";

const resumeButtonClassName =
  "inline-flex items-center justify-center min-h-[36px] px-3 py-1 text-xs font-medium rounded-full text-ink-muted hover:text-ink hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors shrink-0";

/** Slightly past the 4.5rem `scroll-mt` sections land on, so the section a
 * nav click targets reliably reads as active once the scroll settles. */
const NAV_OFFSET_PX = 80;

/** Builds nav pill classes for the active vs inactive state. */
const navPillClass = (active: boolean) =>
  `inline-flex items-center justify-center min-h-[36px] px-3 py-1 text-xs font-medium whitespace-nowrap rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
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
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]?.id ?? "resume");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const sectionIds = new Set(
      NAV_ITEMS.filter((item) => !item.href).map((item) => item.id),
    );

    const syncActiveFromHash = () => {
      if (pathname !== "/") return;
      const id = window.location.hash.replace("#", "");
      if (sectionIds.has(id)) {
        setActiveSection(id);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (pathname !== "/") return;

      let current = NAV_ITEMS[0]?.id ?? "resume";
      for (const item of NAV_ITEMS) {
        if (item.href) continue;
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_OFFSET_PX) {
          current = item.id;
        }
      }
      setActiveSection(current);
    };

    syncActiveFromHash();
    handleScroll();
    window.addEventListener("hashchange", syncActiveFromHash);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("hashchange", syncActiveFromHash);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

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

  const renderNavItem = (item: NavItem, className: string) => {
    const active = isNavItemActive(item, pathname, activeSection);
    const href = navItemHref(item, pathname);

    if (href) {
      return (
        <Link
          key={item.id}
          href={href}
          onClick={() => setMobileMenuOpen(false)}
          aria-current={active ? "page" : undefined}
          className={className}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavClick(item.id)}
        aria-current={active ? "true" : undefined}
        className={className}
      >
        {item.label}
      </button>
    );
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
        <Link
          href="/#resume"
          onClick={(e) => {
            if (pathname !== "/") return;
            e.preventDefault();
            handleNavClick("resume");
          }}
          className="min-w-0 max-w-[45%] sm:max-w-none text-sm font-semibold text-ink truncate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
        >
          Prasad Jawale
        </Link>

        <div className="hidden md:flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              renderNavItem(item, navPillClass(isNavItemActive(item, pathname, activeSection))),
            )}
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
          {NAV_ITEMS.map((item) =>
            renderNavItem(
              item,
              `text-left ${navPillClass(isNavItemActive(item, pathname, activeSection))}`,
            ),
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
