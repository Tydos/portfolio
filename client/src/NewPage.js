import { useState, useEffect } from 'react';
import { Menu, X , User, Code, Zap,Database,Layers, Smartphone,Monitor,Shield,Search,Terminal,Camera,Wind,Linkedin,GitHub ,Cpu,Globe, ChevronRight, Aperture, ExternalLink} from 'react-feather';

// import { Menu,X } from 'lucide-react';

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
          Alex<span className="text-slate-900">.dev</span>
        </div>

        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavClick('about')}
            className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === 'about' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('technical-eye')}
            className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === 'technical-eye' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Tech Eye
          </button>
          <button
            onClick={() => handleNavClick('creative-eye')}
            className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === 'creative-eye' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Creative Eye
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === 'contact' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Contact
          </button>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-8 flex flex-col space-y-4 shadow-xl">
          <button onClick={() => handleNavClick('about')} className="text-left text-xs font-bold uppercase tracking-widest text-slate-700">About</button>
          <button onClick={() => handleNavClick('technical-eye')} className="text-left text-xs font-bold uppercase tracking-widest text-slate-700">Tech Eye</button>
          <button onClick={() => handleNavClick('creative-eye')} className="text-left text-xs font-bold uppercase tracking-widest text-slate-700">Creative Eye</button>
          <button onClick={() => handleNavClick('contact')} className="text-left text-xs font-bold uppercase tracking-widest text-slate-700">Contact</button>
        </div>
      )}
    </nav>
  );
};


const Hero = () => (
  <section id="home" className="pt-64 pb-48 px-6 relative overflow-hidden bg-white">
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-none">
        Architecting <br />
        <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Logic.</span> Capturing <span className="italic font-light">Light.</span>
      </h1>
      <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
        Building the future with code and neural networks. Specialized in React, Python, and Generative AI integration.
      </p>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-32 px-6 bg-slate-50/50">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center space-x-3 mb-6">
            <User className="text-indigo-600" size={20} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">The Human Behind the Screen</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Crafting with <span className="text-indigo-600">Dual Perspectives.</span></h2>
          <p className="text-slate-600 text-xl leading-relaxed mb-8">
            I am a builder who sits at the intersection of rigorous logic and visual storytelling. My journey started in the command line, but it was refined through the viewfinder of a camera. I don't just write code; I design systems that feel as intentional as a well-composed photograph.
          </p>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 italic text-slate-500 flex items-start space-x-4 mb-8">
            {/* <Quote size={24} className="text-indigo-200 flex-shrink-0" /> */}
            <p className="text-lg">Merging the precision of binary with the fluidity of light.</p>
          </div>
        </div>
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-8 rounded-[2rem] flex flex-col justify-center bg-indigo-600 text-white col-span-2">
            <span className="text-4xl font-black mb-1 text-white">6+</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-100">Years Exp</span>
          </div>
          <div className="p-8 rounded-[2rem] flex flex-col justify-center bg-white border border-slate-100 shadow-sm">
            <span className="text-4xl font-black mb-1 text-slate-900">12</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">AI Models Deployed</span>
          </div>
          <div className="p-8 rounded-[2rem] flex flex-col justify-center bg-white border border-slate-100 shadow-sm">
            <span className="text-4xl font-black mb-1 text-slate-900">18</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Countries Photographed</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectCard = ({ title, description, tags, type }) => (
  <div className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
    <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Code size={48} className="text-slate-200 group-hover:text-indigo-600/50 group-hover:scale-110 transition-all duration-500" />
      <div className="absolute top-6 left-6">
        <span className="px-3 py-1 bg-white/90 shadow-sm text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-50">
          {type}
        </span>
      </div>
    </div>
    <div className="p-10">
      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {tags && tags.map((tag, idx) => (
          <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div className="flex space-x-6">
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><Code size={20} /></a>
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><ExternalLink size={20} /></a>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center space-x-2 group/btn">
          <span>Docs</span>
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

const PhotoCard = ({ url, title, location, category }) => (
  <div className="group relative break-inside-avoid mb-6 rounded-[2rem] overflow-hidden bg-slate-900">
    <img src={url} alt={title} className="w-full h-auto object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
      <div className="flex items-center space-x-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">
        <Aperture size={12} />
        <span>{category}</span>
      </div>
      <p className="text-white font-black text-xl leading-tight mb-1">{title}</p>
      <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
        <Globe size={12} />
        <span>{location}</span>
      </div>
    </div>
  </div>
);


function NewPage() {
    const [activeSection, setActiveSection] = useState('home');
  return (
    <>
     <div className="min-h-screen bg-white text-slate-800 selection:bg-indigo-600 selection:text-white font-sans scroll-smooth">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />
      <About />
      <main>
 {/* Technical Toolkit Section (Showcasing "All Icons") */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 block">Visual Language</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Technical Toolkit.</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { Icon: Zap, label: "Fast Performance" },
                { Icon: Cpu, label: "Core Logic" },
                { Icon: Database, label: "Data Structure" },
                { Icon: Layers, label: "System Architecture" },
                { Icon: Smartphone, label: "Mobile First" },
                { Icon: Monitor, label: "Responsive Web" },
                { Icon: Shield, label: "Secure Auth" },
                { Icon: Search, label: "Optimized SEO" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                  <item.Icon className="text-slate-400 mb-4 group-hover:text-indigo-600 transition-colors" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Eye Section */}
        <section id="technical-eye" className="py-32 px-6 bg-slate-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none translate-x-1/3">
            <Terminal size={600} />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="mb-20">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                <Terminal size={14} />
                <span>The Engineering Vision</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Technical Eye.</h2>
              <div className="h-2 w-20 bg-indigo-600 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <ProjectCard title="NeuralCanvas" description="AI platform for high-fidelity 3D assets." tags={["React", "Python", "AWS"]} type="AI Product" />
              <ProjectCard title="QuantFlow" description="Algorithmic trading dashboard with sentiment analysis." tags={["TypeScript", "FastAPI", "Redis"]} type="Software" />
              <ProjectCard title="DocuBrain" description="RAG system for massive internal knowledge bases." tags={["LangChain", "Pinecone", "Next.js"]} type="AI Infrastructure" />
            </div>
          </div>
        </section>

        {/* Creative Eye Section */}
        <section id="creative-eye" className="py-32 px-6 bg-slate-950 text-white overflow-hidden relative">
          <div className="absolute -top-24 -right-24 p-12 opacity-5 pointer-events-none rotate-12">
            <Camera size={600} />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 mb-24 items-end">
              <div className="lg:col-span-6">
                <div className="flex items-center space-x-2 text-rose-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">
                  {/* <FileImage size={14} /> */}
                  <span>The Aesthetic lens</span>
                </div>
                <h2 className="text-6xl font-black mb-8 tracking-tighter">Creative Eye.</h2>
                <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full mb-10" />
                <p className="text-slate-400 text-2xl font-light italic leading-relaxed">
                  "To me, photography is the ultimate form of debugging."
                </p>
              </div>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              <PhotoCard url="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800" title="Alpine Silence" location="Swiss Alps" category="Landscape" />
              <PhotoCard url="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" title="Golden Hour" location="Lofoten" category="Landscape" />
              <PhotoCard url="https://images.unsplash.com/photo-1518005020250-6859b2827c17?auto=format&fit=crop&q=80&w=800" title="Urban Geometry" location="Tokyo" category="Architecture" />
              <PhotoCard url="https://images.unsplash.com/photo-1506744038736-83391884cfb0?auto=format&fit=crop&q=80&w=800" title="Crimson Valley" location="Utah" category="Landscape" />
            </div>
            <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-rose-500"><Wind size={20} /></div>
                <p className="text-slate-400 text-sm font-medium">Finding balance between the <span className="text-white">rigid grid</span> and the <span className="text-white">freeform frame</span>.</p>
              </div>
              <button className="px-10 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-rose-500 hover:text-white transition-all">View Gallery</button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20">
                <div className="grid lg:grid-cols-2 gap-16">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block mb-6">Collab</span>
                    <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">Let's build.</h2>
                    <p className="text-slate-600 text-lg mb-12">Selective consulting and AI partnerships.</p>
                    <div className="space-y-4">
                      <a href="mailto:hello@alexdev.ai" className="block text-2xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">hello@alexdev.ai</a>
                      <div className="flex space-x-6 pt-4">
                        {/* <Github className="text-slate-400 hover:text-slate-900 cursor-pointer" /> */}
                        <Linkedin className="text-slate-400 hover:text-slate-900 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Name" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    <input type="email" placeholder="Email" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    <textarea placeholder="Message" rows="4" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                    <button className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl">Transmit Message</button>
                  </form>
                </div>
            </div>
          </div>
        </section>
      </main>


      <footer className="py-16 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Alex Dev &mdash; Designed by the Eye. Powered by the Machine.
        </p>
      </footer>

        </div>
    </>
  )
}

export default NewPage