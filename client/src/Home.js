import React from 'react'
import { useState} from 'react';
import Contact from './Components/Contact';
import Footer from './Footer/Footer';
import Splash from './Components/Splash';
import About from './Components/About';
import Navbar from './Navbar/Navbar';
import Skills from './Components/Skills';
import Photo from './Components/Photo';
import Projects from './Components/Projects';

function Home() {
    const [activeSection, setActiveSection] = useState('home');
    return (
    <>     
     <div className="bg-white text-slate-800 selection:bg-indigo-600 selection:text-white font-sans scroll-smooth">
       
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
            <Photo/>
        </section>

        <Contact />
      </main> 

       <Footer />
    </div> 
   </>
  )
}

export default Home