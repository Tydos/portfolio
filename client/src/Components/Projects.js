import React from "react";
import ProjectCard from "../Cards/ProjectCard";
import { Terminal } from "react-feather";
import { useState, useEffect } from "react";
import { fetchProjects } from "../api/api";

function Projects() {
  const [projects, setProjects] = useState({});
  useEffect(() => {
    fetchProjects()
      .then((projects) => {
        setProjects(projects);
        console.log("Fetched projects:", projects);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);
  return (
    <>
      <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
        <Terminal size={500} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <Terminal size={20} className="text-rose-500 mb-6" />

          <h2 className="text-4xl font-bold uppercase tracking-tight text-black mb-2">
            Projects
          </h2>

          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
        </div>
        {Object.keys(projects).length === 0 ? (
          <p className="text-red-500 font-italic text-center">
            Error fetching data from backend
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {Object.entries(projects).map(([id, project]) => (
              <ProjectCard key={id} project={project} />
            ))}
          </div>
        )}

        {/* <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <button className="px-10 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-rose-500 hover:text-white transition-all">
            View All Projects
          </button>
        </div> */}
      </div>
    </>
  );
}

export default Projects;
