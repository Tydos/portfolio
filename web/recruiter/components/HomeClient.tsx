"use client";

import About from "./sections/About";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Projects from "./sections/Projects";
import Resume from "./sections/Resume";
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
        <About />

        <div className="border-t border-slate-100">
          <section id="resume" className="py-16 md:py-20 px-6 scroll-mt-24">
            <Resume />
          </section>

          <section
            id="technical-eye"
            className="py-16 md:py-20 px-6 scroll-mt-24"
          >
            <Projects projects={projects} />
          </section>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default HomeClient;
