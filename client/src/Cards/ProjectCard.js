import React from "react";
import { Code } from "react-feather";

function ProjectCard({ project }) {
  return (
    <div className="relative group w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">

      {/* Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay only on Image */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Tags & Hover Buttons on Image */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2 z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/30 text-white text-xs font-semibold rounded-full backdrop-blur-xl"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Title Bar Below Image, Solid Background */}
     <div className="bg-white p-4 border-t border-slate-200 flex flex-col items-start justify-center gap-2">
  <h2 className="text-slate-500 text-md md:text-md font-medium leading-snug text-center">
    {project.title}
  </h2>

  {project.description && project.description.trim() !== "" && (
  <p className="text-slate-400 text-sm text-justify max-w-md">
    {project.description}
  </p>
)}

  {project.github && (
    <a
      href={project.github}
      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-all mt-1"
    >
      <Code size={14} />
      Code
    </a>
  )}
</div>

    </div>
  );
}

export default ProjectCard;