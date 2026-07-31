import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const title = project.title?.trim() ? project.title : "Project";
  const imageUrl = project.image?.trim() || "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex w-full min-h-[5.5rem] flex-row md:min-h-0 md:flex-col rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {imageUrl && (
        <div className="relative w-[7.25rem] shrink-0 self-stretch sm:w-32 md:w-full md:h-56 md:self-auto overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 128px, 33vw"
            className="object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3 md:px-5 md:py-4">
        <h3 className="text-ink font-semibold text-sm leading-snug sm:text-base line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        {project.description && (
          <p className="text-ink-muted text-xs sm:text-sm mt-1 line-clamp-2 md:mt-1.5">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProjectCard;
