"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ProjectCard from "../cards/ProjectCard";
import SectionTitle from "../ui/SectionTitle";
import { ChevronDown, ChevronUp } from "react-feather";
import type { Project } from "../../types";
import { GITHUB_USERNAME } from "../../constants/config";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  { ssr: false },
);

const INITIAL_COUNT = 4;

interface ProjectsProps {
  projects: Project[];
}

function Projects({ projects }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  return (
    <div className="max-w-6xl mx-auto">
      <SectionTitle>Projects</SectionTitle>

      <div className="github-calendar -mx-1 mb-8 flex justify-center overflow-x-auto px-1 md:mb-12">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          colorScheme="light"
          theme={{
            light: ["#ecfdf5", "#bbf7d0", "#4ade80", "#16a34a", "#15803d"],
          }}
          fontSize={12}
          blockRadius={3}
          blockMargin={9}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 md:mt-10">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] border border-slate-200 hover:border-slate-300 text-ink-muted hover:text-ink text-sm font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {showAll ? (
              <>
                Show fewer projects <ChevronUp size={15} aria-hidden="true" />
              </>
            ) : (
              <>
                Show {projects.length - INITIAL_COUNT} more projects{" "}
                <ChevronDown size={15} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;
