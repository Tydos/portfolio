import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "react-feather";
import GitHubIcon from "../ui/GitHubIcon";
import { CONTACT, HERO, SITE, SOCIAL_LINKS } from "../../constants/config";

const githubHref = SOCIAL_LINKS.find((link) => link.label === "GitHub")?.href ?? "https://github.com/Tydos";

/** Hero / identity section: portrait, name, role, and contact CTAs. */
function About() {
  return (
    <section
      id="about"
      className="min-h-dvh flex flex-col items-center justify-center pt-28 md:pt-32 pb-16 md:pb-20 px-6 scroll-mt-24 text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <Image
          src={SITE.ogImage}
          alt="Portrait of Prasad Jawale"
          width={200}
          height={200}
          className="mb-6 md:mb-8 rounded-full shadow-lg w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] mx-auto object-cover"
          priority
        />

        <h1 className="text-hero font-semibold text-ink">
          {HERO.name}
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-ink-muted font-medium">
          {HERO.role}
        </p>
        <p className="mt-6 text-lg text-ink-muted max-w-2xl leading-relaxed">
          {HERO.proof}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="#resume"
            className="inline-flex items-center justify-center min-h-[44px] px-7 py-2.5 bg-accent hover:bg-accent-hover text-white text-base font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View resume
          </Link>
          <Link
            href="#technical-eye"
            className="inline-flex items-center justify-center gap-1 min-h-[44px] px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-ink text-base font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View projects
          </Link>
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-accent hover:text-accent-hover text-base font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <GitHubIcon size={18} />
            GitHub
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-accent hover:text-accent-hover text-base font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Linkedin size={18} aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
