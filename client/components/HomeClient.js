'use client';

import React from 'react'
import { useState } from 'react';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
import Splash from './sections/Splash';
import About from './sections/About';
import Navbar from './layout/Navbar';
import Resume from './sections/Resume';
import Photography from './sections/Photography';
import Projects from './sections/Projects';

function HomeClient() {
    const [activeSection, setActiveSection] = useState("home");
    return (
    <>
     <div className="text-slate-800 selection:bg-indigo-600 selection:text-white font-sans scroll-smooth">

       <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
       <main>
        <Splash />
        <About />
        <section id="resume" className="py-32 px-6">
          <Resume/>
        </section>

        <section id="technical-eye" className="py-32 px-6 bg-slate-50/50 relative overflow-hidden">
        <Projects/>
        </section>


        <section id="creative-eye" className="py-32 px-6 bg-slate-950 text-white overflow-hidden relative">
            <Photography/>
        </section>

        <Contact />
      </main>

       <Footer />
    </div>
   </>
  )
}

export default HomeClient
