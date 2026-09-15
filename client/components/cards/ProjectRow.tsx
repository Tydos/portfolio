"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Code, ExternalLink } from "react-feather";
import { shouldInterceptLinkClick } from "../../lib/linkClicks";
import type { Project } from "../../types";

interface ProjectRowProps {
  project: Project;
}

const MAX_VISIBLE_TAGS = 5;

/**
 * Project row: text on the left, media on the right; optimized for quick scanning.
 *
 * @param props.project - Project content to display.
 */
function ProjectRow({ project }: ProjectRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const title = project.title?.trim() ? project.title : "Project";
  const imageUrl = project.image?.trim() || "";
  const teaser =
    project.summary?.trim() ||
    project.description?.trim() ||
    "";
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
      className={`relative flex flex-col gap-4 md:flex-row md:items-start md:gap-8 lg:gap-10 group ${
        isPending ? "pointer-events-none" : ""
      }`}
      aria-busy={isPending}
    >
      <Link
        href={projectHref}
        onClick={(e) => {
          if (!shouldInterceptLinkClick(e)) return;
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

      <div className="relative order-1 flex min-w-0 flex-1 flex-col md:max-w-[52%] pointer-events-none">
        <h3 className="text-lg font-semibold text-ink leading-snug md:text-xl">
          {title}
        </h3>

        {teaser ? (
          <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-2">
            {teaser}
          </p>
        ) : null}

        {visibleTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 border border-slate-200 bg-slate-50 text-ink-muted text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 ? (
              <span className="px-2 py-0.5 text-xs font-medium text-ink-muted/80">
                +{hiddenTagCount}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent group-hover:bg-accent group-hover:text-white transition-colors">
            View project
            <ArrowRight size={14} aria-hidden="true" />
          </span>

          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              <Code size={13} aria-hidden="true" />
              Source
            </a>
          ) : null}

          {project.link && project.link !== project.github ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Live
            </a>
          ) : null}
        </div>
      </div>

      {imageUrl ? (
        <div className="relative order-2 w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[160/93] md:w-[42%] md:ml-auto">
          <Image
            src={imageUrl}
            alt={`Screenshot of ${title}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover motion-safe:group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </div>
      ) : null}
    </article>
  );
}

export default ProjectRow;
