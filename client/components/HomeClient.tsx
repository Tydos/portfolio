"use client";

import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import HeroStrip from "./sections/HeroStrip";
import PortfolioTeaser from "./sections/PortfolioTeaser";
import Projects from "./sections/Projects";
import Resume from "./sections/Resume";
import { INCLUDE_PHOTOGRAPHY } from "../constants/config";
import type { Project } from "../types";

interface HomeClientProps {
  projects: Project[];
}

/**
 * Client shell for the home page: nav, recruiter sections, footer.
 *
 * @param props.projects - Featured projects rendered in the Projects section.
 */
function HomeClient({ projects }: HomeClientProps) {
  return (
    <div className="text-ink selection:bg-accent selection:text-white font-sans">
      <Navbar />
      <main>
        <section
          id="resume"
          className="pt-[5.25rem] pb-16 md:pb-20 px-4 sm:px-6 scroll-mt-[4.5rem]"
        >
          <HeroStrip />
          <Resume />
        </section>

        <div className="border-t border-slate-100">
          <section
            id="projects"
            className="py-16 md:py-20 px-4 sm:px-6 scroll-mt-[4.5rem]"
          >
            <Projects projects={projects} />
          </section>
        </div>

        {INCLUDE_PHOTOGRAPHY ? (
          <div className="border-t border-slate-100">
            <section
              id="portfolio-teaser"
              className="py-16 md:py-20 scroll-mt-[4.5rem]"
            >
              <PortfolioTeaser />
            </section>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default HomeClient;
