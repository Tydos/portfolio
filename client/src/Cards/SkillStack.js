import React from 'react'

function SkillStack({ group }) {
  return (
    <>
    <div className="group relative">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{group.title}</h3>
      {/* <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> */}
    </div>
    <div className="space-y-2">
      {group.items.map((skill, idx) => (
        <div key={idx} className="flex items-center group/skill">
          <div className="w-full bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between group-hover/skill:border-indigo-200 group-hover/skill:shadow-sm transition-all">
            <span className="text-xs font-bold text-slate-600 group-hover/skill:text-indigo-600">{skill}</span>
            {/* <span className="text-[10px] font-mono text-slate-300">STK_0{idx+1}</span> */}
          </div>
        </div>
      ))}
    </div>
  </div>
    </>
  )
}

export default SkillStack