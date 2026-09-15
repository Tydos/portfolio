"use client";

import { useMemo, useState } from "react";
import ProjectRow from "../cards/ProjectRow";
import SectionTitle from "../ui/SectionTitle";
import Reveal from "../ui/Reveal";
import { ChevronDown, ChevronUp } from "react-feather";
import type { Project } from "../../types";
import {
  PROJECT_FILTER_OPTIONS,
  filterProjectsByCategory,
  type ProjectFilterId,
} from "../../lib/projectFilters";

const INITIAL_COUNT = 4;

const filterPillClass = (active: boolean) =>
  `min-h-[36px] px-3.5 py-1 text-xs font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    active
      ? "bg-ink text-white"
      : "text-ink-muted hover:text-ink bg-slate-50 hover:bg-slate-100 border border-slate-200/80"
  }`;

interface ProjectsProps {
  projects: Project[];
}

/**
 * Featured projects list with category filters and optional expand/collapse.
 *
 * @param props.projects - Curated projects to display.
 */
function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectFilterId>("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => filterProjectsByCategory(projects, filter),
    [projects, filter],
  );

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  const handleFilterChange = (id: ProjectFilterId) => {
    setFilter(id);
    setShowAll(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionTitle>Projects</SectionTitle>

      <div
        className="flex flex-wrap gap-2 -mt-4 mb-8 md:mb-10"
        role="group"
        aria-label="Filter projects by category"
      >
        {PROJECT_FILTER_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleFilterChange(id)}
            aria-pressed={filter === id}
            className={filterPillClass(filter === id)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted py-8">
          No projects in this category yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {visible.map((project, i) => (
            <Reveal
              key={project.slug}
              className={
                i > 0
                  ? "mt-8 pt-8 border-t border-slate-100 md:mt-10 md:pt-10"
                  : ""
              }
            >
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      )}

      {hasMore && filtered.length > 0 ? (
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
                Show {filtered.length - INITIAL_COUNT} more projects{" "}
                <ChevronDown size={15} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Projects;
