import React from "react";
import { useState, useEffect } from "react";
import SkillStack from "../cards/SkillStack";
import {
  Database,
  BookOpen,
  Cpu,
  ExternalLink,
  CheckCircle,
} from "react-feather";
import { fetchSkills } from "../../api/api";

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600">{icon}</div>
    <h2 className="text-neutral-900 leading-none text-xl font-black text-slate-900">
      {title}
    </h2>
  </div>
);

const ExperienceSection = ({ experience }) => (
  <section>
    <SectionHeader title="Experience" icon={<Database size={18} />} />
    <div className="relative border-l-2 border-neutral-100 ml-3 space-y-12 py-2">
      {experience.map((exp, idx) => (
        <div key={idx} className="relative pl-12">
          {/* Timeline Dot */}
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-neutral-200" />

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
            <h3 className="text-lg font-bold text-neutral-900">{exp.role}</h3>
            <span className="text-sm text-neutral-400">{exp.period}</span>
          </div>
          <p className="text-neutral-500 font-medium mb-4">{exp.company}</p>

          <ul className="space-y-3">
            {exp.details.map((detail, i) => (
              <li
                key={i}
                className="text-slate-500 text-md md:text-md max-w-2xl font-medium leading-snug flex items-start gap-3 tracking-normal"
              >
                <span className="mt-1 w-2 h-2 bg-neutral-300 rounded-full flex-shrink-0" />
                <p className="text-left">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

function Skills() {
  const [skills, setSkills] = useState(null);
  const [skillsFetchError, setSkillsFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSkills()
      .then((data) => {
        if (cancelled) return;
        setSkillsFetchError(false);
        setSkills(data && typeof data === "object" && !Array.isArray(data) ? data : {});
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        if (!cancelled) {
          setSkillsFetchError(true);
          setSkills({});
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resumeData = {
    experience: [
      {
        role: "Data Analyst Intern (NLP)",
        company: "Wisconsin School of Business",
        period: "Oct '24 - Present",
        details: [
          "Engineered a batch ETL pipeline in Python and SQL to ingest and normalize structured hotel reviews, enabling downstream NLP analysis at scale.",
          "Stabilized model performance across demographic segments by implementing a robust SpaCy text preprocessing pipeline, reducing variance in F1 scores.",
          "Designed a modular topic modeling service using Sequential LDA to automate the categorization of customer sentiment in reviews.",
          "Improved topic coherence by 7% by transitioning from Sequential LDA to BERTopic with transformer-based embeddings.",
        ],
      },
      {
        role: "Android Development Intern",
        company: "StoccGuru",
        period: "Jun '21 - Aug '21",
        details: [
          "Integrated the Android XML front-end with a Python Flask backend via REST APIs, achieving response times under 250ms.",
          "Developed a comprehensive automated testing suite using Postman for unit and integration tests, significantly reducing API failure rates in production.",
          "Delivered core backend modules across 5 sprints using Agile/Jira methodologies, ensuring 100% on-time release.",
        ],
      },
    ],
    education: [
      {
        school: "University of Wisconsin - Madison",
        degree: "M.S. Data Science",
        period: "2024 - 2026",
      },
      {
        school: "University of Mumbai",
        degree: "B.Tech. AI & DS",
        period: "2020 - 2024",
      },
    ],
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h2 className="text-3xl tracking-tighter leading-[1.1] uppercase font-bold text-slate-900 mb-6 border-b-4 border-indigo-500 pb-2 inline-block">
                Summary
              </h2>
              <p className="text-slate-500 text-md md:text-md max-w-2xl mx-auto font-medium leading-relaxed">
                On the application side, I build backend systems using FastAPI
                and Flask, and create user interfaces with React and Tailwind. I
                work with databases such as PostgreSQL and MongoDB to design
                reliable data systems. I deploy projects using AWS, Docker, and
                CI/CD pipelines to ensure smooth, production-ready performance.
                <br />
                <br />
                I’ve worked on ML projects using PyTorch and BERT for NLP tasks,
                including spam detection and topic modeling with BERTopic. My
                experience also covers distributed training and hyperparameter
                optimization with Optuna.
                <br />
                <br />
                I’ve also explored search and retrieval systems using FAISS and
                Elasticsearch, and recently started experimenting with LangChain
                for LLM-based applications, along with blockchain-based projects
                to better understand decentralized system design.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-16">
            <section>
              <SectionHeader title="Skills" icon={<CheckCircle size={18} />} />
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10">
                {skillsFetchError ? (
                  <p className="text-red-500 italic text-center">
                    Could not load skills from the server.
                  </p>
                ) : skills === null ? (
                  <p className="text-slate-400 text-center text-sm">Loading skills…</p>
                ) : Object.keys(skills).length === 0 ? (
                  <p className="text-slate-500 text-center text-sm">
                    No skills are listed yet.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 col-span-4 gap-5">
                    {Object.keys(skills).map((key) => (
                      <SkillStack key={key} group={skills[key]} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            <ExperienceSection experience={resumeData.experience} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <SectionHeader
                  title="Education"
                  icon={<BookOpen size={18} />}
                />
                <div className="space-y-6">
                  {resumeData.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-400 p-6 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
                    >
                      <h4 className="font-bold text-white">{edu.school}</h4>
                      <p className="font-medium text-white mb-2">
                        {edu.degree}
                      </p>
                      <p className="font-medium text-white mb-2">
                        {edu.period}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader title="Publications" icon={<Cpu size={18} />} />
                <div className="bg-indigo-400 p-6 rounded-xl text-neutral-300 text-sm leading-relaxed shadow-lg flex flex-col justify-center">
                  <p className="text-xl font-bold mb-4 text-white">
                    LightGBM and Gradient Boosting for Optimizing Shipment Mode
                    in Pharmaceutical Supply Chains
                  </p>
                  <p className="font-medium text-white mb-2">
                    Springer Singapore
                  </p>
                  <a
                    href="https://link.springer.com/chapter/10.1007/978-981-96-2179-8_36"
                    className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    Read Paper <ExternalLink size={12} />
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Skills;
