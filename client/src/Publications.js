import React from 'react'
import Publication from './PublicationsCard'
function Publications() {
  return (
    <>
    <section id="papers"></section>
     <div class="p-10 items-start bg-gray-100 min-h-screen">

    <div class="my-5 text-5xl">
    <h2>Publications</h2>
    </div>
    <div class="py-5"></div>
    <Publication/>
    </div>
    
    </>
  )
}

export default Publications
