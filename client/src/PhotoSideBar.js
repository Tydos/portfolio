// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const PhotoSideBar = () => {
  return (
    <aside className="w-40 h-screen bg-white border-r border-gray-300 p-4 sticky top-0">
      <h2 className="text-lg font-bold mb-6 text-center">Gallery</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="#2019"
            className="block text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300"
          >
            2019
          </a>
        </li>
        <li>
          <a
            href="#2020"
            className="block text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300"
          >
            2020
          </a>
        </li>
        <li>
          <a
            href="#2021"
            className="block text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300"
          >
            2021
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="block text-black font-thin hover:bg-gray-200 active:bg-gray-800 rounded-md px-3 py-2 text-sm transition ease-in-out duration-300"
          >
            Contact
          </a>
        </li>
      </ul>
    </aside>
  )
};

export default PhotoSideBar;
