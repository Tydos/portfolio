import React from "react";
import SkillStack from "../cards/SkillStack";
import {
  Database,
  BookOpen,
  Cpu,
  ExternalLink,
  CheckCircle,
} from "react-feather";
import {
  RESUME_SKILL_GROUPS,
  RESUME_SUMMARY_PARAGRAPHS,
  RESUME_EXPERIENCE,
  RESUME_EDUCATION,
  RESUME_PUBLICATION,
  RESUME_SECTION_LABELS,
} from "../../constants/resume";

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
    <SectionHeader
      title={RESUME_SECTION_LABELS.experience}
      icon={<Database size={18} />}
    />
    <div className="relative border-l-2 border-neutral-100 ml-3 space-y-12 py-2">
      {experience.map((exp, idx) => (
        <div key={idx} className="relative pl-12">
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

function Resume() {
  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h2 className="text-3xl tracking-tighter leading-[1.1] uppercase font-bold text-slate-900 mb-6 border-b-4 border-indigo-500 pb-2 inline-block">
                {RESUME_SECTION_LABELS.summary}
              </h2>
              <p className="text-slate-500 text-md md:text-md max-w-2xl mx-auto font-medium leading-relaxed">
                {RESUME_SUMMARY_PARAGRAPHS.map((paragraph, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                    {paragraph}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-16">
            <section>
              <SectionHeader
                title={RESUME_SECTION_LABELS.skills}
                icon={<CheckCircle size={18} />}
              />
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 col-span-4 gap-5">
                  {RESUME_SKILL_GROUPS.map((group) => (
                    <SkillStack key={group.title} group={group} />
                  ))}
                </div>
              </div>
            </section>

            <ExperienceSection experience={RESUME_EXPERIENCE} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <SectionHeader
                  title={RESUME_SECTION_LABELS.education}
                  icon={<BookOpen size={18} />}
                />
                <div className="space-y-6">
                  {RESUME_EDUCATION.map((edu, idx) => (
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
                <SectionHeader
                  title={RESUME_SECTION_LABELS.publications}
                  icon={<Cpu size={18} />}
                />
                <div className="bg-indigo-400 p-6 rounded-xl text-neutral-300 text-sm leading-relaxed shadow-lg flex flex-col justify-center">
                  <p className="text-xl font-bold mb-4 text-white">
                    {RESUME_PUBLICATION.title}
                  </p>
                  <p className="font-medium text-white mb-2">
                    {RESUME_PUBLICATION.publisher}
                  </p>
                  <a
                    href={RESUME_PUBLICATION.url}
                    className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    {RESUME_SECTION_LABELS.readPaper}{" "}
                    <ExternalLink size={12} />
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

export default Resume;
