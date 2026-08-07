import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, ExternalLink } from "react-feather";
import type { Project } from "../../types";

interface ProjectRowProps {
  project: Project;
  index: number;
}

const MAX_VISIBLE_TAGS = 4;

function ProjectRow({ project, index }: ProjectRowProps) {
  const title = project.title?.trim() ? project.title : "Project";
  const imageUrl = project.image?.trim() || "";
  const reversed = index % 2 === 1;
  const visibleTags = project.tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const hiddenTagCount = (project.tags?.length ?? 0) - visibleTags.length;

  return (
    <article
      className={`flex flex-col gap-6 md:flex-row md:items-center md:gap-10 ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >
      {imageUrl && (
        <Link
          href={`/projects/${project.slug}`}
          className="group relative block w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[16/10] md:w-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      <div className="flex min-w-0 flex-1 flex-col md:w-1/2">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
        >
          <h3 className="text-xl font-bold text-ink leading-snug hover:text-accent transition-colors md:text-2xl">
            {title}
          </h3>
        </Link>

        {project.description && (
          <p className="mt-3 text-sm text-ink-muted leading-relaxed md:text-base">
            {project.description}
          </p>
        )}

        {visibleTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className="px-2.5 py-1 text-slate-400 text-xs font-medium">
                +{hiddenTagCount} more
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
          >
            View project
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              <Code size={14} aria-hidden="true" />
              Source
            </a>
          )}

          {project.link && project.link !== project.github && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectRow;
