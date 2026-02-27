import React from "react";

function Splash() {
  return (
    <>
      <section
        id="home"
        className="min-h-screen relative overflow-hidden  flex flex-col justify-center items-center px-6"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[96px] animate-pulse [animation-duration:4s]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-rose-500/30 rounded-full mix-blend-multiply filter blur-[96px] animate-pulse [animation-duration:5s]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-amber-400/30 rounded-full mix-blend-multiply filter blur-[96px] animate-pulse [animation-duration:6s]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
            Architecting{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Logic.
            </span>
            <br className="hidden md:block" /> Capturing{" "}
            <span className="italic font-light text-slate-500 relative">
              Light.
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-rose-400/40"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q 50 20 100 10"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Passionate about machine learning and building smart systems. I
            architect websites, build Android apps, and wire up APIs. Off-duty,
            I read, play, and see the world through a lens.
          </p>
        </div>
      </section>
    </>
  );
}

export default Splash;
