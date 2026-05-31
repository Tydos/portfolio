import React from "react";
import ProjectCard from "../cards/ProjectCard";
import { Terminal } from "react-feather";
import type { Project } from "../../types";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  { ssr: false }
);
import { GITHUB_USERNAME } from "../../constants/config";

interface ProjectsProps {
  projects: Project[];
}

function Projects({ projects }: ProjectsProps) {
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
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Projects;
