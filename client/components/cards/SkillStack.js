import React from "react";
import { Layers } from "react-feather";

function SkillStack({ group }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
          <Layers size={14} strokeWidth={2} />
        </div>
        <h3 className="text-sm font-bold leading-snug text-slate-900 not-italic">
          {group.title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.items.map((skill, idx) => (
          <span
            key={idx}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillStack;
