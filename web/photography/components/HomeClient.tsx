"use client";

import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import EditorialHero from "./sections/EditorialHero";
import Portfolio from "./sections/Portfolio";

/**
 * Client shell for the photography site: nav, editorial hero, gallery, footer.
 */
function HomeClient() {
  return (
    <div className="photo-theme min-h-screen bg-wired-paper text-wired-black font-sans selection:bg-wired-black selection:text-wired-yellow">
      <Navbar />
      <main>
        <EditorialHero />
        <section id="gallery" className="pb-16 md:pb-20 overflow-hidden">
          <Portfolio />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomeClient;
