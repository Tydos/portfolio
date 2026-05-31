'use client';

import React, { useState, useEffect } from "react";
import ProjectCard from "../cards/ProjectCard";
import { Terminal } from "react-feather";
import { fetchProjects } from "../../lib/api";
import type { Project } from "../../types";

function Projects() {
  const [projects, setProjects] = useState<Record<string, Project> | null>(null);
  const [projectsFetchError, setProjectsFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (cancelled) return;
        setProjectsFetchError(false);
        setProjects(
          data && typeof data === "object" && !Array.isArray(data) ? data : {}
        );
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        if (!cancelled) {
          setProjectsFetchError(true);
          setProjects({});
        }
      });
    return () => {
      cancelled = true;
    };
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
        {projectsFetchError ? (
          <p className="text-red-500 italic text-center">
            Could not load projects from the server.
          </p>
        ) : projects === null ? (
          <p className="text-slate-500 text-center text-sm">Loading projects…</p>
        ) : Object.keys(projects).length === 0 ? (
          <p className="text-slate-600 text-center text-sm">
            No projects to show yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {Object.entries(projects).map(([id, project]) => (
              <ProjectCard key={id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
