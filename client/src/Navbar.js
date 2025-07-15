import React from "react"
import { Link } from 'react-router-dom';

function Navbar() {

    return (
      <>
<nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-14 items-center justify-between">
      
    
      <div className="flex-shrink-0 px-3 py-2 text-black text-lg font-thin">
       Prasad Jawale
      </div>


      <div className="flex space-x-4 justify-center">
         <Link to="/" target="_blank" rel="noopener noreferrer">
          <p className="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Home</p>
        </Link> 
        <Link to="https://drive.google.com/file/d/1UqYBGXWALr-qUguouPiUmbJs6HknohKs/view" target="_blank" rel="noopener noreferrer">
          <p className="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Resume</p>
        </Link>
        <Link to="/Photo" target="_blank" rel="noopener noreferrer">
          <p className="text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300">Photography</p>
        </Link> 
      </div>
    </div>
  </div>
</nav>

    </>
      


    );
}

export default Navbar