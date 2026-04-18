import React from 'react';

function Footer() {
  return (
        <footer className="py-16 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} Prasad Jawale. All rights reserved.
        </p>
      </footer>

  );
}

export default Footer;
