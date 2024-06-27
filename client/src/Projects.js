import React from 'react'
import Projectcard from './ProjectCard'

function Projects() {
  return (
    <>
    <section id="projects"></section>
      <div class="p-10 items-start bg-gray-100 min-h-screen">

      <div class="my-5 text-5xl">
      <h2>Projects</h2>
      </div>
      <div class="py-5"></div>
      <Projectcard/>
      </div>
    </>
  )
}

export default Projects