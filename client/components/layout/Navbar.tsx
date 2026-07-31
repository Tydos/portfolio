'use client';

import { useState, useEffect, useId } from "react";
import { Menu, X } from "react-feather";
import { NAV_ITEMS } from "../../constants/config";

const NAV_OFFSET_PX = 96;

/** Map sub-sections to their parent nav target */
const SECTION_TO_NAV: Record<string, string> = {
  resume: "work",
  "technical-eye": "work",
};

function resolveNavSection(sectionId: string): string {
  return SECTION_TO_NAV[sectionId] ?? sectionId;
}

function Navbar() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]?.id ?? "about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const trackedIds = [
        ...NAV_ITEMS.map((item) => item.id),
        "resume",
        "technical-eye",
      ];

      let current = NAV_ITEMS[0]?.id ?? "about";
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_OFFSET_PX) {
          current = resolveNavSection(id);
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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Main"
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-sm border-b border-slate-200 py-3 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a
          href="#about"
          className="text-nav font-semibold uppercase text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
        >
          Prasad Jawale
        </a>

        <div className="hidden md:flex gap-8">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavClick(id)}
              aria-current={activeSection === id ? "true" : undefined}
              className={`text-nav uppercase font-semibold transition-colors min-h-[44px] px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded ${
                activeSection === id
                  ? "text-accent"
                  : "text-ink-muted hover:text-accent"
              }`}
            >
              {label}
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
          className="md:hidden bg-white border-b border-slate-200 px-6 py-6 flex flex-col gap-2"
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavClick(id)}
              aria-current={activeSection === id ? "true" : undefined}
              className={`text-left text-sm font-semibold uppercase tracking-wide min-h-[44px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded ${
                activeSection === id
                  ? "text-accent"
                  : "text-ink hover:text-accent"
              }`}
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
