"use client";

import { useState } from "react";
import ProjectCard from "../cards/ProjectCard";
import { Terminal, ChevronDown, ChevronUp } from "react-feather";
import type { Project } from "../../types";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  { ssr: false },
);
import { GITHUB_USERNAME } from "../../constants/config";

const INITIAL_COUNT = 6;

interface ProjectsProps {
  projects: Project[];
}

function Projects({ projects }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

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

        <div className="github-calendar mb-16 flex justify-center">
          <GitHubCalendar
            username={GITHUB_USERNAME}
            colorScheme="light"
            theme={{
              light: ["#fdfdfd", "#bbf7d0", "#4ade80", "#16a34a", "#14532d"],
            }}
            fontSize={12}
            blockRadius={3}
            blockMargin={9}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-sm font-semibold rounded-full transition-colors"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={15} />
                </>
              ) : (
                <>
                  View More ({projects.length - INITIAL_COUNT} more){" "}
                  <ChevronDown size={15} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
