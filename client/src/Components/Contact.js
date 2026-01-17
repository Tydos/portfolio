import React from 'react'
import { Mail, Code, Linkedin} from 'react-feather';

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-white">
         <div className="max-w-5xl mx-auto">
           <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
             <div className="grid lg:grid-cols-2 gap-16 relative z-10">
               <div>
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block mb-6">Collab</span>
                 <h2 className="text-5xl font-black text-slate-900 mb-8 leading-none">Let's build <br /> something.</h2>
                 <p className="text-slate-600 text-lg mb-12">Let's connect over e-mail!</p>
                 <div className="space-y-4">
                   {/* <a href="mailto:hello@alexdev.ai" className="block text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">pjawale@wisc.edu</a> */}
                   <div className="flex space-x-6 pt-4 text-slate-400">
                     <Code size={20} className="hover:text-slate-900 cursor-pointer transition-colors" />
                     <Linkedin size={20} className="hover:text-slate-900 cursor-pointer transition-colors" />
                     <Mail size={20} className="hover:text-slate-900 cursor-pointer transition-colors" />
                   </div>
                 </div>
               </div>
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <input type="text" placeholder="Name" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
                 <input type="email" placeholder="Email" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
                 <textarea placeholder="Message" rows="4" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"></textarea>
                 <button className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200">Sent Message</button>
               </form>
             </div>
           </div>
         </div>
       </section>
  )
}

export default Contact