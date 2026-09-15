import Link from "next/link";
import {
  ENGINEERING_HOME_URL,
  PORTFOLIO_HERO,
} from "../../../constants/portfolioHero";

/** Minimal fixed header: site title and link back to the engineering site. */
function PhotographyNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-wired-black text-wired-paper border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center gap-4">
        <a
          href="#top"
          className="text-sm font-bold uppercase tracking-widest text-wired-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
        >
          {PORTFOLIO_HERO.role}
        </a>
        <Link
          href={ENGINEERING_HOME_URL}
          className="text-sm font-medium text-white/70 hover:text-wired-yellow transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow shrink-0"
        >
          Engineering
        </Link>
      </div>
    </header>
  );
}

export default PhotographyNavbar;
