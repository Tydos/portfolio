import { HERO, RECRUITER_SITE_URL } from "../../constants/config";

/** Minimal fixed header: site title and link back to the engineering site. */
function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-wired-black text-wired-paper border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <a
          href="#top"
          className="text-sm font-bold uppercase tracking-widest text-wired-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
        >
          {HERO.role}
        </a>
        <a
          href={RECRUITER_SITE_URL}
          className="text-sm font-medium text-white/70 hover:text-wired-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
        >
          Engineering
        </a>
      </div>
    </header>
  );
}

export default Navbar;
