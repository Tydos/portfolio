import React from "react"
import { useState, useEffect } from 'react';
import { Menu, X} from 'react-feather';

function Navbar({ activeSection, setActiveSection }) {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);  

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'technical-eye' },
    { name: 'Photography', id: 'creative-eye' },
    // { name: 'Resume', id: 'resume' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };


    return (
      <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
              <div className="text-left text-xs font-bold uppercase tracking-widest text-slate-700">
                Prasad Jawale
              </div>
      
              <div className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === item.id ? 'text-indigo-600' : 'text-slate-500'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
      
              <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
      
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-slate-200 px-6 py-8 flex flex-col space-y-4 shadow-xl">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="text-left text-xs font-bold uppercase tracking-widest text-slate-700"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </nav>
      </>
    );
}

export default Navbar