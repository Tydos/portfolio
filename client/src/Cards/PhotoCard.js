import React from 'react'

function PhotoCard({ photo }) {
  return (
    <>
     <div className="group relative break-inside-avoid mb-6 rounded-[2rem] overflow-hidden">
    <img 
      src={photo.url} 
      alt={photo.title}
      className="w-full h-auto object-cover group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
      <div className="flex items-center space-x-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">
        {/* <Aperture size={12} /> */}
        {/* <span>{photo.category}</span> */}
      </div>
      {/* <p className="text-white font-black text-xl leading-tight mb-1">{photo.title}</p>
      <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
        <Globe size={12} />
        <span>{photo.location}</span>
      </div> */}
    </div>
  </div>
    </>
  )
}

export default PhotoCard
