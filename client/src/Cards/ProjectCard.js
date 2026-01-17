import React from 'react'
import {GitBranch} from 'react-feather';

function ProjectCard({ project }) {
  return (
   <>
<div className="group relative bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col h-full">
    {/* Image Container */}
    <div className="h-80 bg-slate-100 relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
      />
      
      <div className="absolute top-5 left-5 z-20">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md shadow-sm text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/50">
          {project.type}
        </span>
      </div>
    </div>

    {/* Content Container */}
    <div className="p-8 flex flex-col flex-1">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>
      </div>

      {/* Full Description */}
      <p className="text-slate-600 text-base leading-relaxed mb-8 font-medium">
        {project.description}
      </p>

      {/* Key Features */}
      {/* <div className="mb-8">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
          <span className="w-4 h-px bg-slate-200"></span>
          <span>Features</span>
          <span className="w-full h-px bg-slate-200"></span>
        </h4>
        <ul className="space-y-3">
          {project.features.map((feature, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm font-medium">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Tags (Bottom Pushed) */}
      <div className="mt-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg border border-slate-200 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        {/* <a 
          href={project.link} 
          className="flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
        >
          <Globe size={18} />
          <span>Demo</span>
        </a> */}
        <a 
          href={project.github} 
          className="flex items-center justify-center space-x-2 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl font-bold transition-all active:scale-95"
        >
          <GitBranch size={18} />
          <span>Code</span>
        </a>
      </div>
    </div>
  </div>
   </>
  )
}

export default ProjectCard
