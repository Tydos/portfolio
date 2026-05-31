import React from "react";
import { User, Code, Linkedin, Instagram } from "react-feather";

function About() {
  return (
    <div>
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-6 text-slate-400">
              <User className="text-indigo-600" size={20} />
              <span className="text-sm font-black uppercase tracking-widest">
                Prasad Jawale
              </span>
            </div>

            <h2 className="text-3xl tracking-tighter leading-[1.1] uppercase font-bold text-slate-900 mb-6 border-b-4 border-indigo-500 pb-2 inline-block">
              About Me
            </h2>

            <p className="text-slate-500 text-md md:text-md max-w-2xl font-medium leading-relaxed mb-6">
             Hi, I'm Prasad. I'm pursuing my Master's in Data Science, where I focus on machine learning and building intelligent systems. I enjoy designing and developing websites, Android apps, and building APIs, and I'm interested in creating clean, minimalistic solutions that solve real problems.
             <br></br>
             Outside of tech, I'm passionate about photography, especially astrophotography and landscapes. I enjoy planning night shoots, working with long exposures, and refining images in Lightroom. I also like biking, playing guitar, and reading nonfiction, which keeps me curious and always learning.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://github.com/Tydos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors text-2xl"
              >
                <Code />
              </a>
              <a
                href="https://www.instagram.com/prasaadjawale/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors text-2xl"
              >
                <Instagram />
              </a>
              <a
                href="https://linkedin.com/in/prasadjawale"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors text-2xl"
              >
                <Linkedin />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <img
              src="https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg"
              alt="Prasad Jawale"
              className="rounded-3xl shadow-xl w-full max-w-xs object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
