import React from 'react'
import { useState} from 'react';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import Splash from './components/sections/Splash';
import About from './components/sections/About';
import Navbar from './components/layout/Navbar';
import Skills from './components/sections/Skills';
import Photography from './components/sections/Photography';
import Projects from './components/sections/Projects';

function Home() {
    const [activeSection, setActiveSection] = useState("home");
    return (
    <>     
     <div className="text-slate-800 selection:bg-indigo-600 selection:text-white font-sans scroll-smooth">
       
       <Navbar activeSection={activeSection} setActiveSection={setActiveSection} /> 
       <main>
        <Splash />
        <About />
        <section id="skills" className="py-32 px-6">
          <Skills/>
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

export default Home