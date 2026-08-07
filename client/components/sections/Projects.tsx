"use client";

import { useState } from "react";
import ProjectRow from "../cards/ProjectRow";
import SectionTitle from "../ui/SectionTitle";
import Reveal from "../ui/Reveal";
import { ChevronDown, ChevronUp } from "react-feather";
import type { Project } from "../../types";
import { GITHUB_USERNAME } from "../../constants/config";

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

      <p className="mb-8 md:mb-10 text-sm text-ink-muted">
        Curated work —{" "}
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
        >
          @{GITHUB_USERNAME} on GitHub
        </a>
      </p>

      <div className="flex flex-col">
        {visible.map((project, i) => (
          <Reveal
            key={project.slug}
            className={i > 0 ? "mt-10 pt-10 border-t border-slate-100 md:mt-16 md:pt-16" : ""}
          >
            <ProjectRow project={project} index={i} />
          </Reveal>
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
