import React from 'react';
import SocialMedia from './SocialMedia';

function Footer() {
  return (
    <footer className="w-full p-6 bg-white text-white">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/2 p-2 text-center md:text-left">
          <h1 className=" text-xl text-black">Prasad Jawale</h1>
        </div>
        <div className="w-full md:w-1/2 p-2 text-center md:text-right">
          <SocialMedia />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
