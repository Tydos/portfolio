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
      className="group block w-full rounded-xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300"
    >
      {imageUrl && (
        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="px-5 py-4">
        <h2 className="text-slate-800 font-semibold text-base leading-snug group-hover:text-indigo-600 transition-colors">
          {title}
        </h2>
        {project.description && (
          <p className="text-slate-400 text-sm mt-1.5">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProjectCard;
