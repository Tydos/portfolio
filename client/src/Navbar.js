import React from "react"
import { Link } from 'react-router-dom';

function Navbar() {

    return (
      <>
<nav class="sticky backdrop-blur-xl top-0 z-10">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-10 items-center justify-center">
      <div class="flex flex-1 items-center justify-center sm:justify-center">
        <div class="block">
          <div class="flex space-x-4 justify-center">
            <a href="#start" class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">About</a>
            <a href="#skills" class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Skills</a>
            <a href="#projects" class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Projects</a>
            <a href="#papers" class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Papers</a>
            <a href="#contact" class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Contact</a>
            <Link to="https://drive.google.com/file/d/1UqYBGXWALr-qUguouPiUmbJs6HknohKs/view" target="_blank" rel="noopener noreferrer"><p class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Resume</p></Link>
            <Link to="/Photo" target="_blank" rel="noopener noreferrer"><p class="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Photography</p></Link> 
          </div>
        </div>
      </div>
    </div>
  </div>

</nav>
    </>
      


    );
}

export default Navbar