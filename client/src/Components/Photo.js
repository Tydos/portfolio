import React from 'react'
import { Camera } from 'react-feather';
import PhotoCard from '../Cards/PhotoCard';
import { useState, useEffect } from 'react';

function Photo() {
  const [photography, setPhotography] = useState({});
  useEffect(() => {
          fetch("https://portfolio-backend-server-phi.vercel.app/api/photographs")
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              return res.json();
            })
            .then((photography) => {
              setPhotography(photography);
              console.log("Fetched photography:", photography);
            })
            .catch((err) => console.error("Error fetching data:", err));
        }, []);
  
  return (
    <>
     <div className="absolute -top-24 -right-24 p-12 opacity-5 pointer-events-none rotate-12">
                <Camera size={600} />
              </div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 mb-24 items-end">
                  <div className="lg:col-span-6">
                    <div className="flex items-center space-x-2 text-rose-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">
                      <Camera size={20} />
                    {/* <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block">Photography</span> */}
                    </div>
                    <h2 className="text-6xl text-white mb-8 ">Photography</h2>
                    <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full mb-10" />
                    <p className="text-slate-400 text-2xl font-light italic leading-relaxed">
                      {/* "{DATA.photography.philosophy}" */}
                    </p>
                  </div>
                  <div className="lg:col-span-6 lg:text-right text-left">
                    <div className="inline-grid grid-cols-2 gap-8">
                      <div>
                        {/* <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Selected Gear</span> */}
                        {/* <p className="text-sm text-slate-300 font-medium leading-relaxed">Sony A7R IV<br />35mm f/1.4 GM<br />85mm f/1.8 G</p> */}
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Focus Areas</span>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Astrophotgraphy<br />Landscapes<br />Urban Nightscapes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {DATA.photography.gallery.map((photo, idx) => (
                    <PhotoCard key={idx} photo={photo} />
                  ))}
                </div> */}
                  {Object.keys(photography).length === 0 ? (
                <p className="text-red-500 font-italic text-center">
                Error fetching data from backend
              </p>
              ) :  (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-6 space-y-6">
                  {Object.entries(photography).map(([id, photo]) => (
                <PhotoCard key={id} photo={photo} />
              ))}
              </div>
                )}
    
    
    
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* <div className="flex items-center space-x-4">
                    {/* <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-rose-500">
                      <Wind size={20} />
                    </div> */}
                    {/* <p className="text-slate-400 text-sm font-medium">Finding balance between the <span className="text-white">rigid grid</span> and the <span className="text-white">freeform frame</span>.</p> */}
                  {/* </div> */} 
                  <button className="px-10 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-rose-500 hover:text-white transition-all">
                    View Full Gallery
                  </button>
                </div>
              </div>
    </>
  )
}

export default Photo