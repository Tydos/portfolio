"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Code, ExternalLink } from "react-feather";
import type { Project } from "../../types";

interface ProjectRowProps {
  project: Project;
  index: number;
}

const MAX_VISIBLE_TAGS = 4;

/**
 * Alternating project row with media, tags, and links to the detail page.
 *
 * @param props.project - Project content to display.
 * @param props.index - Row index; odd indices reverse the media/text layout.
 */
function ProjectRow({ project, index }: ProjectRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const title = project.title?.trim() ? project.title : "Project";
  const imageUrl = project.image?.trim() || "";
  const reversed = index % 2 === 1;
  const visibleTags = project.tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const hiddenTagCount = (project.tags?.length ?? 0) - visibleTags.length;
  const projectHref = `/projects/${project.slug}`;

  function openProject() {
    startTransition(() => {
      router.push(projectHref);
    });
  }

  return (
    <article
      className={`relative flex flex-col gap-6 md:flex-row md:items-center md:gap-10 group ${
        reversed ? "md:flex-row-reverse" : ""
      } ${isPending ? "pointer-events-none" : ""}`}
      aria-busy={isPending}
    >
      <Link
        href={projectHref}
        onClick={(e) => {
          e.preventDefault();
          openProject();
        }}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`View project: ${title}`}
      />

      {isPending && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-accent animate-spin motion-reduce:animate-none motion-reduce:border-accent" />
          <span className="sr-only">Loading project</span>
        </div>
      )}

      {imageUrl && (
        <div className="relative w-full shrink-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 aspect-[16/10] md:w-1/2">
          <Image
            src={imageUrl}
            alt={`Screenshot of ${title}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover motion-safe:group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col md:w-1/2 pointer-events-none">
        <h3 className="text-xl font-bold text-ink leading-snug group-hover:text-accent transition-colors md:text-2xl">
          {title}
        </h3>

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
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent transition-colors">
            View project
            <ArrowRight size={15} aria-hidden="true" />
          </span>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
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
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
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
