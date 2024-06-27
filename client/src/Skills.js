import React from 'react'
import SkillCardComponent from './SkillCardComponent'
function Skills() {
  return (
    <>
    <section id="skills"></section>
    <div class="pl-10 py-10 items-start bg-gray-100 min-h-screen">

<div class="text-5xl">
<h2>Skills</h2>
</div>
<div class="my-5 text-2xl">
<h1> Below are some of my skills and the technologies i've previously worked on, and I'm always looking to learn more.
</h1>
</div>
<SkillCardComponent/>  
</div>
    </>
  )
}

export default Skills