import React from "react";

function SkillStack({ group }) {
  return (
    <>
      <div className="group relative space-y-4">
        <h3 className="text-sm tracking-normal text-center text-slate-800">
          {group.title}
        </h3>

        <div className="space-y-2">
          {group.items.map((skill, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-full p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center transition-all hover:border-indigo-300 hover:shadow-sm">
                <span className="text-xs text-slate-600 hover:text-indigo-600">
                  {skill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SkillStack;
