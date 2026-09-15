"use client";

import PhotographyFooter from "./photography/layout/Footer";
import PhotographyNavbar from "./photography/layout/Navbar";
import EditorialHero from "./photography/sections/EditorialHero";
import Portfolio from "./photography/sections/Portfolio";

/**
 * Client shell for the photography site: wired nav, editorial hero, gallery, footer.
 */
function PortfolioPageClient() {
  return (
    <div className="photo-theme min-h-screen bg-wired-paper text-wired-black font-sans selection:bg-wired-black selection:text-wired-yellow">
      <PhotographyNavbar />
      <main>
        <EditorialHero />
        <section id="gallery" className="pb-16 md:pb-20 overflow-hidden">
          <Portfolio />
        </section>
      </main>
      <PhotographyFooter />
    </div>
  );
}

export default PortfolioPageClient;
