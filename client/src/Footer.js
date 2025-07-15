import React from 'react';
import SocialMedia from './SocialMedia';

function Footer() {
  return (
   <footer className="w-full bg-violet-600 text-white py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">

    <div className="text-center md:text-left">
      <h1 className="text-2xl text-white ">Prasad Jawale</h1>
      <p className="text-sm mt-1 text-violet-100">© {new Date().getFullYear()} All rights reserved.</p>
    </div>

    <div className="text-center md:text-right">
      <SocialMedia />
    </div>
  </div>
</footer>

  );
}

export default Footer;
