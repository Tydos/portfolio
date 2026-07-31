import { ExternalLink } from "react-feather";
import SectionTitle from "../ui/SectionTitle";
import {
  RESUME_SUMMARY_PARAGRAPHS,
  RESUME_EXPERIENCE,
  RESUME_EDUCATION,
  RESUME_PUBLICATION,
  RESUME_SECTION_LABELS,
} from "../../constants/resume";
import type { Experience } from "../../types";

interface SubsectionTitleProps {
  title: string;
}

interface ExperienceSectionProps {
  experience: Experience[];
}

const SubsectionTitle = ({ title }: SubsectionTitleProps) => (
  <h3 className="text-base font-semibold text-ink mb-5">{title}</h3>
);

const ExperienceSection = ({ experience }: ExperienceSectionProps) => (
  <section>
    <SubsectionTitle title={RESUME_SECTION_LABELS.experience} />
    <div className="relative border-l border-slate-200 ml-2 space-y-8 py-1">
      {experience.map((exp, idx) => (
        <div key={idx} className="relative pl-8">
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h4 className="text-base font-semibold text-ink">{exp.role}</h4>
            <span className="text-sm text-ink-muted shrink-0">{exp.period}</span>
          </div>
          <p className="text-ink-muted text-sm mb-2">{exp.company}</p>

          <ul className="space-y-1.5">
            {exp.details.map((detail, i) => (
              <li
                key={i}
                className="text-ink-muted text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1 before:h-1 before:rounded-full before:bg-slate-300"
              >
                {detail}
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
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionTitle>Resume</SectionTitle>
            <p className="text-ink-muted text-sm leading-relaxed max-w-prose -mt-4">
              {RESUME_SUMMARY_PARAGRAPHS[0]}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-10">
          <ExperienceSection experience={RESUME_EXPERIENCE} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 border-t border-slate-100">
            <section>
              <SubsectionTitle title={RESUME_SECTION_LABELS.education} />
              <ul className="space-y-4">
                {RESUME_EDUCATION.map((edu, idx) => (
                  <li key={idx}>
                    <p className="font-medium text-ink">{edu.school}</p>
                    <p className="text-sm text-ink-muted mt-0.5">
                      {edu.degree} · {edu.period}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SubsectionTitle title={RESUME_SECTION_LABELS.publications} />
              <p className="text-sm font-medium text-ink leading-snug">
                {RESUME_PUBLICATION.title}
              </p>
              <p className="text-sm text-ink-muted mt-1">
                {RESUME_PUBLICATION.publisher}
              </p>
              <a
                href={RESUME_PUBLICATION.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded transition-colors"
              >
                {RESUME_SECTION_LABELS.readPaper}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
