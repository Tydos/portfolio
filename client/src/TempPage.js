
import React, { useState, useEffect } from 'react';
import { Menu, X , User, Mail, Code,  Terminal,Camera,Wind,Linkedin,Globe, ChevronRight, Aperture, ExternalLink} from 'react-feather';

const DATA = {
  name: "Prasad",
  role: "Full Stack Engineer & AI Developer",
  about: {
    story: "I am a developer who works at the intersection of logic and creativity. I focus on creating experiences, not just software, by combining strong problem solving with thoughtful design. Whether I am building websites, training machine learning models, or taking photographs, I aim to create work that is both purposeful and engaging.",
    motto: "Merging the precision of binary with the fluidity of light.",
    stats: [
    //   { label: "Years Exp", value: "6+" },
    //   { label: "AI Models Deployed", value: "12" },
    //   { label: "Countries Photographed", value: "18" }
    ]
  },
  bio: "I’m a grad student at UW–Madison passionate about machine learning and building smart systems. I also code websites and build Android apps, and work with APIs and databases. Off-duty, I read, play, and take photos.",
  skills: [
    { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "TypeScript"], color: "indigo" },
    { name: "Backend", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis"], color: "emerald" },
    { name: "AI/ML", items: ["PyTorch", "HuggingFace", "LangChain", "Vector DBs", "HuggingFace"], color: "rose" },
    { name: "DevOps", items: ["Docker", "AWS", "Git", "CI/CD"], color: "amber" }
  ],
  projects: [
  {
    title: "Cyberbullying Detection using Deep Learning",
    description:
      "A deep learning system to identify derogatory tweets related to gender, race, age, religion, ethnicity, or sexual orientation. Built on a dataset of 110,000 tweets and evaluated using SVM, Random Forest, BERT, and an ensemble of BERT and LSTM models.",
    tags: [
      "Deep Learning",
      "Natural Language Processing",
      "BERT",
      "LSTM",
      "Text Classification",
      "Social Media Analysis",
      "Python"
    ],
    link: "https://github.com/Tydos/Cyberbullying-Detection",
    github: "https://github.com/Tydos/Cyberbullying-Detection",
    type: "Deep Learning",
    image:
      "https://raw.githubusercontent.com/Tydos/Cyberbullying-Detection/main/accuracy_comparison.jpg"
  },
  {
    title: "Anuvadak: Indian Sign Language Recognition",
    description:
      "A deep learning based ISL recognition system using CNN-LSTM architectures. Data was captured via OpenCV, augmented, and processed using MediaPipe Holistic for feature extraction, achieving 85% accuracy. Includes Android deployment.",
    tags: [
      "Deep Learning",
      "Computer Vision",
      "Gesture Recognition",
      "CNN",
      "LSTM",
      "MediaPipe",
      "OpenCV"
    ],
    link: "https://github.com/Tydos/ISL",
    github: "https://github.com/Tydos/ISL",
    type: "Deep Learning",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719502253/ssnop_g67nmy.png"
  },
  {
    title: "Portfolio Website",
    description:
      "A full-stack MERN portfolio website styled with Tailwind CSS. Features dynamic project rendering from MongoDB and a photography showcase with images served via Cloudinary.",
    tags: [
      "Full Stack",
      "MERN",
      "React",
      "MongoDB",
      "Tailwind CSS",
      "Cloudinary",
      "Web Design"
    ],
    link: "https://github.com/Tydos/portfolio",
    github: "https://github.com/Tydos/portfolio",
    type: "Web Development",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500501/Screenshot_2024-06-27_203121_atzojq.png"
  },
  {
    title: "Supply Chain Management of Pharmaceutical Drugs",
    description:
      "A machine learning solution to optimize shipment modes for pharmaceutical drugs. Trained on a 10,000-row supply chain dataset considering expiry dates, shipping costs, and drug types to determine the fastest and most cost-effective delivery method.",
    tags: [
      "Machine Learning",
      "Optimization",
      "Supply Chain",
      "Predictive Modeling",
      "Data Analysis",
      "Python"
    ],
    link: "https://github.com/Arnav047/Supply-Chain-Management",
    github: "https://github.com/Arnav047/Supply-Chain-Management",
    type: "Machine Learning",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719502354/summary_bzpbtl.png"
  },
  {
    title: "DocSpot",
    description:
      "A document-sharing platform for students using MongoDB and ElasticSearch. PDFs are converted into embeddings using Google Gemini, enabling semantic retrieval. A fine-tuned Google T5 model acts as a chatbot over stored notes.",
    tags: [
      "Retrieval Augmented Generation",
      "Semantic Search",
      "NLP",
      "ElasticSearch",
      "MongoDB",
      "Chatbot",
      "Embeddings"
    ],
    link: "https://github.com/Tydos/DocSpot",
    github: "https://github.com/Tydos/DocSpot",
    type: "Web Development",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500204/Screenshot_2024-06-05_214207_k8psav.png"
  },
  {
    title: "Guardify: Cyber Security Portal",
    description:
      "A cyber security portal for managing and reporting cyberbullying complaints. Integrates a machine learning classifier to categorize complaints and stores records in MongoDB for administrative review.",
    tags: [
      "Cybersecurity",
      "Web Application",
      "Machine Learning",
      "Text Classification",
      "MongoDB",
      "Full Stack"
    ],
    link: "https://github.com/satts27/HackOverflow-1.0-BitbyBit",
    github: "https://github.com/satts27/HackOverflow-1.0-BitbyBit",
    type: "Web Development",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500441/acf91f47-97c8-42ed-b66a-a98844e1a0ad_ki38x1.jpg"
  },
  {
    title: "CowSense",
    description:
      "A platform for Indian dairy farmers featuring a deep learning model trained on 5,000 cow images to detect lumpy skin disease. Includes image-based diagnosis and Google Maps integration for locating nearby veterinary clinics.",
    tags: [
      "Deep Learning",
      "Computer Vision",
      "Healthcare AI",
      "Image Classification",
      "Agritech",
      "Google Maps API"
    ],
    link: "https://github.com/SinghShreyansh/LBS-Dairy",
    github: "https://github.com/SinghShreyansh/LBS-Dairy",
    type: "Deep Learning",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500136/Screenshot_2023-07-22_173642_zsk5l5.png"
  }
],

  photography: {
    philosophy: "",
    gallery: [
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629005/Photographs/DSC08656-01_kgqggd.jpg",
    title: "Alpine Silence",
    location: "Swiss Alps",
    category: "Landscape"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/20211126_154906_ge2g9t.jpg",
    title: "Deep Forest",
    location: "Oregon, USA",
    category: "Nature"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629005/Photographs/DSC00018_q3fjzn.jpg",
    title: "Golden Hour",
    location: "Lofoten, Norway",
    category: "Landscape"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/20211124_123051_hclxud.jpg",
    title: "Orbital View",
    location: "The Stratosphere",
    category: "Aero"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/DSC00336-01_dkqmq1.jpg",
    title: "Urban Geometry",
    location: "Tokyo, Japan",
    category: "Architecture"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/IMG_0083_pm39pe.jpg",
    title: "Crimson Valley",
    location: "Utah, USA",
    category: "Landscape"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/HD_20200507_222920_NR-01-01_kqtjpi.jpg",
    title: "Celestial Paths",
    location: "Atacama, Chile",
    category: "Astrophotography"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/IMG_0257_jwbwb6.jpg",
    title: "Monolithic Echo",
    location: "Iceland",
    category: "Landscape"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/DSC09078-01_c2ixdk.jpg",
    title: "Silent Corridor",
    location: "Northern Europe",
    category: "Minimalism"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/IMG_0093_2_w82dy6.jpg",
    title: "Neon Pulse",
    location: "Urban Nightscape",
    category: "Street"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629008/Photographs/IMG_20190305_215357_yank7x.jpg",
    title: "Desert Bloom",
    location: "Western India",
    category: "Landscape"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629008/Photographs/IMG_20190214_070326123_yelnrg.jpg",
    title: "Still Reflections",
    location: "Coastal India",
    category: "Travel"
  },
  {
    url: "https://res.cloudinary.com/duws62b88/image/upload/v1686629011/Photographs/LRM_EXPORT_20190121_074405_1_vx3ous.jpg",
    title: "Morning Transit",
    location: "South Asia",
    category: "Street"
  }
]

  }
};

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'technical-eye' },
    { name: 'Photography', id: 'creative-eye' },
    { name: 'Resume', id: 'resume' },
    { name: 'Contact', id: 'contact' }
  ];

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
          {DATA.name.split(' ')[0]}<span className="text-slate-900">.live</span>
        </div>

        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-[10px] uppercase tracking-widest font-black transition-colors hover:text-indigo-600 ${activeSection === item.id ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-8 flex flex-col space-y-4 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-left text-xs font-bold uppercase tracking-widest text-slate-700"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="min-h-screen pt-64 pb-48 px-6 relative overflow-hidden bg-white">
    <div className=" max-w-5xl mx-auto text-center relative z-10">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-none">
        Architecting <br />
        <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Logic.</span> Capturing <span className="italic font-light">Light.</span>
      </h1>
      <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
        {DATA.bio}
      </p>
    </div>
  </section>
);

const About = () => (
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
            {DATA.about.story}
          </p>
          
        </div>
        <img src="https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg" alt="profilepic" className="w-full lg:col-span-5 rounded-3xl shadow-lg border border-slate-100" />
        {/* <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {DATA.about.stats.map((stat, i) => (
            <div key={i} className={`p-8 rounded-[2rem] flex flex-col justify-center ${i === 0 ? 'bg-indigo-600 text-white col-span-2' : 'bg-white border border-slate-100 shadow-sm'}`}>
              <span className={`text-4xl font-black mb-1 ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{stat.value}</span>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${i === 0 ? 'text-indigo-100' : 'text-slate-400'}`}>{stat.label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  </section>
);

const SkillStack = ({ group }) => (
  <div className="group relative">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{group.name}</h3>
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
    </div>
    <div className="space-y-2">
      {group.items.map((skill, idx) => (
        <div key={idx} className="flex items-center group/skill">
          <div className="w-full bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between group-hover/skill:border-indigo-200 group-hover/skill:shadow-sm transition-all">
            <span className="text-xs font-bold text-slate-600 group-hover/skill:text-indigo-600">{skill}</span>
            {/* <span className="text-[10px] font-mono text-slate-300">STK_0{idx+1}</span> */}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PhotoCard = ({ photo }) => (
  <div className="group relative break-inside-avoid mb-6 rounded-[2rem] overflow-hidden">
    <img 
      src={photo.url} 
      alt={photo.title}
      className="w-full h-auto object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
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
);

const ProjectCard = ({ project }) => (
  <div className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
    <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* <Code size={48} className="text-slate-200 group-hover:text-indigo-600/50 group-hover:scale-110 transition-all duration-500" /> */}
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      <div className="absolute top-6 left-6">
        <span className="px-3 py-1 bg-white/90 shadow-sm text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-50">
          {project.type}
        </span>
      </div>
    </div>
    <div className="p-10">
      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div className="flex space-x-6">
          <a href={project.github} className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
            <Code size={20} />
          </a>
          {/* <a href={project.link} className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
            <ExternalLink size={20} />
          </a> */}
        </div>
        {/* <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center space-x-2 group/btn">
          <span>Documentation</span>
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button> */}
      </div>
    </div>
  </div>
);

const Contact = () => {
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
  );
};
function TempPage() {
    const [activeSection, setActiveSection] = useState('home');
    return (
   <>
    <div className="bg-white text-slate-800 selection:bg-indigo-600 selection:text-white font-sans scroll-smooth">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <Hero />
        <About />

        {/* Technical DNA */}
        <section id="skills" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 block">Skills</span>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 leading-none">Skills</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    A multi-threaded approach to engineering, ranging from system architecture to generative intelligence.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10">
                {DATA.skills.map((skillGroup) => (
                  <SkillStack key={skillGroup.name} group={skillGroup} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Eye Section */}
        <section id="technical-eye" className="py-32 px-6 bg-slate-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none translate-x-1/3">
            <Terminal size={600} />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-xl">
                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                  <Terminal size={20} />
                   <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block">Projects</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">Projects</h2>
                <div className="h-2 w-20 bg-indigo-600 rounded-full" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DATA.projects.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </div>
            <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            
             <button className="px-10 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-rose-500 hover:text-white transition-all">
                View All Projects
              </button>
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
                  <Camera size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block">Photography</span>
                </div>
                <h2 className="text-6xl text-white mb-8 ">Photography</h2>
                <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full mb-10" />
                <p className="text-slate-400 text-2xl font-light italic leading-relaxed">
                  "{DATA.photography.philosophy}"
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
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {DATA.photography.gallery.map((photo, idx) => (
                <PhotoCard key={idx} photo={photo} />
              ))}
            </div>
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
        </section>

        <Contact />
      </main>

      <footer className="py-16 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Prasad Jawale. All rights reserved.
        </p>
      </footer>
    </div>
   </>
  )
}

export default TempPage



   
