"use client";

import About from "./sections/About";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Portfolio from "./sections/Portfolio";
import Projects from "./sections/Projects";
import Resume from "./sections/Resume";
import type { Project } from "../types";

interface HomeClientProps {
  projects: Project[];
}

function HomeClient({ projects }: HomeClientProps) {
  return (
    <div className="text-ink selection:bg-accent selection:text-white font-sans">
      <Navbar />
      <main>
        <About />

        <div id="work" className="scroll-mt-24">
          <section id="resume" className="py-16 md:py-20 px-6 border-t border-slate-100">
            <Resume />
          </section>

          <section
            id="technical-eye"
            className="py-16 md:py-20 px-6 scroll-mt-24"
          >
            <Projects projects={projects} />
          </section>
        </div>

        <section
          id="creative-eye"
          className="py-16 md:py-20 scroll-mt-24 overflow-hidden border-t border-slate-100"
        >
          <Portfolio />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomeClient;
