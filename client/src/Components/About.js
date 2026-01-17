import React from 'react'
import {User} from 'react-feather';

function About() {
  return (
    <div>
          <section id="about" className="  min-h-screen py-32 px-6 bg-slate-50/50">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="text-indigo-600" size={20} />
                    <span className="text-xl font-black uppercase tracking-widest text-slate-400">Prasad Jawale</span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 leading-none">About Me</h2>
                  <p className="text-slate-600 text-xl leading-relaxed mb-8">
                    I am a developer who works at the intersection of logic and creativity. I focus on creating experiences, not just software, by combining strong problem solving with thoughtful design. Whether I am building websites, training machine learning models, or taking photographs, I aim to create work that is both purposeful and engaging.
                  </p>
                  
                </div>
                <img src="https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg" alt="profilepic" className="w-full lg:col-span-5 rounded-3xl shadow-lg border border-slate-100" />
              </div>
            </div>
          </section>
    </div>
  )
}

export default About