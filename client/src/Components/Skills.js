import React from 'react'
import { useState, useEffect } from 'react';
import SkillStack from '../Cards/SkillStack';
function Skills() {
    const [skills, setSkills] = useState({});
    useEffect(() => {
            fetch("https://portfolio-backend-server-phi.vercel.app/api/skills")
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
              })
              .then((skills) => {
                setSkills(skills);
                console.log("Fetched skills:", skills);
              })
              .catch((err) => console.error("Error fetching data:", err));
          }, []);
    
  return (
    <>
    
 <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 block">Skills</span>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 leading-none">Skills</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    A multi-threaded approach to engineering, ranging from system architecture to generative intelligence.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10">
                {/* {DATA.skills.map((skillGroup) => (
                  <SkillStack key={skillGroup.name} group={skillGroup} /> */}

                  
            {Object.keys(skills).length === 0 ? (
            <p className="text-red-500 font-italic text-center">
            Error fetching data from backend
          </p>
          ) :  (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 col-span-4 gap-5">
        {Object.keys(skills).map((key) => (
        <SkillStack key={key} group={skills[key]} />
          ))}
          </div>
            )}


              </div>
            </div>
          </div>
    </>
  )
}

export default Skills
