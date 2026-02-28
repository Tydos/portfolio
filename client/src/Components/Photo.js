import React from "react";
import { Camera } from "react-feather";
import { useState, useEffect } from "react";
import Gallery from "../Components/Gallery";


function Photo() {
  const [photos, setPhotos] = useState([]); 
  
    useEffect(() => {
    fetch("https://portfolio-backend-server-phi.vercel.app/fetch?limit=100&offset=0")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Map API data to Gallery format
        const formattedPhotos = data.map((item) => ({
          src: item.url,          // adjust if your API uses another key
          width: item.width || 2000,
          height: item.height || 2000,
        }));

        setPhotos(formattedPhotos);
        console.log("Fetched photography:", formattedPhotos);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

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

  
        <div className="max-w-6xl mx-auto">
          <Gallery photos={photos}/>
        </div>


      </div>
    </>
  );
}

export default Photo;
