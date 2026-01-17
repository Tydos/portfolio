import React from 'react'
import ProjectCard from '../Cards/ProjectCard'
import {Terminal} from 'react-feather';
import { useState, useEffect } from 'react'

function Projects() {
  const [projects, setProjects] = useState({});
  useEffect(() => {
          fetch("https://portfolio-backend-server-phi.vercel.app/api/projects")
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              return res.json();
            })
            .then((projects) => {
              setProjects(projects);
              console.log("Fetched projects:", projects);
            })
            .catch((err) => console.error("Error fetching data:", err));
        }, []);
  return (
    <>
     <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none translate-x-1/3">
                <Terminal size={600} />
              </div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div className="max-w-xl">
                    <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                      <Terminal size={20} />
                       {/* <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block">Projects</span> */}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">Projects</h2>
                    <div className="h-2 w-20 bg-indigo-600 rounded-full" />
                  </div>
                </div>
    
    
                {Object.keys(projects).length === 0 ? (
                <p className="text-red-500 font-italic text-center">
                Error fetching data from backend
              </p>
              ) :  (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
                  {Object.entries(projects).map(([id, project]) => (
                <ProjectCard key={id} project={project} />
              ))}
              </div>
                )}
    
    
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                 <button className="px-10 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-rose-500 hover:text-white transition-all">
                    View All Projects
                  </button>
                  </div>
              </div>
    </>
  )
}

export default Projects