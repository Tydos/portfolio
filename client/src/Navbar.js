import React from "react"
import { Link } from 'react-router-dom';

function Navbar() {

    return (
      <>
<nav class="sticky top-0 z-10">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-12 items-center justify-center">
      <div class="flex flex-1 items-center justify-center sm:justify-center">
        <div class="block">
          <div class="flex space-x-4 justify-center">
            <Link to="/"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Home</p></Link>
            <Link to="/Photo"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Gallery</p></Link>
            {/* <Link to="/Resume"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Resume</p></Link> */}
            <Link to="/Projects"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Projects</p></Link>
            {/* <Link to="/Contact"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Contact</p></Link> */}
            {/* <Link to="/Publications"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Publications</p></Link> */}
            <Link to="/Contact"><p class="text-white font-thin hover:bg-gray-700 active:bg-gray-800 rounded-md px-3 py-2 text-base transition ease-in-out duration-300">Contact me</p></Link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="sm:hidden" id="mobile-menu">
    <div class="space-y-1 px-2 pb-3 pt-2">
      <a href="#" class="bg-gray-900 text-white font-thin block rounded-md px-3 py-2 text-sm hover:bg-gray-700 active:bg-gray-800 transition ease-in-out duration-300" aria-current="page">Gallery</a>
      <a href="#" class="text-gray-300 font-thin hover:bg-gray-700 active:bg-gray-800 block rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Resume</a>
      <a href="#" class="text-gray-300 font-thin hover:bg-gray-700 active:bg-gray-800 block rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Projects</a>
      <a href="#" class="text-gray-300 font-thin hover:bg-gray-700 active:bg-gray-800 block rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Contact</a>
    </div>
  </div>
</nav>


      {/* <Outlet /> */}
    </>
      


    );
}

export default Navbar