import React from "react";
import { Camera } from "react-feather";
import { useState, useEffect } from "react";
import Gallery from "../Components/Gallery";

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
  void photography;
  return (
    <>
      {/* Background Icon */}
      <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
        <Camera size={500} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <Camera size={20} className="text-rose-500 mb-6" />

          <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
            Photography
          </h2>

          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
        </div>

        {/* {!Object.keys(photography).length ? (
      <p className="text-red-500 text-center italic">
        Error fetching data from backend
      </p>
    ) : (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-6">
        {Object.entries(photography).map(([id, photo]) => (
          <PhotoCard key={id} photo={photo} />
        ))}
      </div>
    )} */}
        <div className="max-w-6xl mx-auto">
          <Gallery />
        </div>

        {/* <div className="mt-24 pt-12 border-t border-white/5 text-center">
      <button className="px-10 py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-full hover:bg-rose-500 hover:text-white transition">
        View Full Gallery
      </button>
    </div> */}
      </div>
    </>
  );
}

export default Photo;
