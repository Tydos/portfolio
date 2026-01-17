import React from 'react'
import { useState, useEffect } from 'react';
import { Menu, X , User, Terminal, Camera, ChevronRight, Globe, GitHub, GitBranch} from 'react-feather';
import Contact from './Components/Contact';
import Footer from './Footer/Footer';
import Splash from './Components/Splash';
import About from './Components/About';
import Navbar from './Navbar/Navbar';
import ProjectCard from './Cards/ProjectCard';
import PhotoCard from './Cards/PhotoCard'; 
import Skills from './Components/Skills';
import Photo from './Components/Photo';
import Projects from './Components/Projects';
function Home() {
    const [activeSection, setActiveSection] = useState('home');
    // const [projects, setProjects] = useState({});
    // const [photography, setPhotography] = useState({});
    
      // useEffect(() => {
      //   fetch("https://portfolio-backend-server-phi.vercel.app/api/projects")
      //     .then((res) => {
      //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      //       return res.json();
      //     })
      //     .then((projects) => {
      //       setProjects(projects);
      //       console.log("Fetched projects:", projects);
      //     })
      //     .catch((err) => console.error("Error fetching data:", err));
      // }, []);

      // useEffect(() => {
      //   fetch("https://portfolio-backend-server-phi.vercel.app/api/photographs")
      //     .then((res) => {
      //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      //       return res.json();
      //     })
      //     .then((photography) => {
      //       setPhotography(photography);
      //       console.log("Fetched photography:", photography);
      //     })
      //     .catch((err) => console.error("Error fetching data:", err));
      // }, []);

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

        {/* Technical Eye Section */}
        <section id="technical-eye" className="py-32 px-6 bg-slate-50/50 relative overflow-hidden">
        <Projects/>
        </section>

        {/* Creative Eye Section */}
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