import React from "react";

function Splash() {
    return(
        <>

 <section id="home" className="min-h-screen pt-64 pb-48 px-6 relative overflow-hidden bg-white">
    <div className=" max-w-5xl mx-auto text-center relative z-10">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-none">
        Architecting <br />
        <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Logic.</span> Capturing <span className="italic font-light">Light.</span>
      </h1>
      <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
        "I’m a grad student at UW–Madison passionate about machine learning and building smart systems. I also code websites and build Android apps, and work with APIs and databases. Off-duty, I read, play, and take photos."
      </p>
    </div>
  </section>
           </>
    )
}

export default Splash;