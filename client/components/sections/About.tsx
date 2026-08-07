import Image from "next/image";
import Link from "next/link";
import { HERO } from "../../constants/config";

function About() {
  return (
    <section
      id="about"
      className="min-h-dvh flex items-center pt-28 md:pt-32 pb-16 md:pb-20 px-6 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight leading-[1.05]">
            {HERO.name}
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-accent font-medium">
            {HERO.role}
          </p>
          <p className="mt-6 text-base text-ink-muted max-w-prose leading-relaxed">
            {HERO.proof}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#resume"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View resume
            </Link>
            <Link
              href="#technical-eye"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 border border-slate-200 hover:border-slate-300 text-ink text-sm font-semibold rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View projects
            </Link>
            {/* <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 border border-accent/30 bg-accent-subtle hover:border-accent/50 text-accent text-sm font-semibold rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Mail size={15} aria-hidden="true" />
              Get in touch
            </a> */}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <Image
            src="https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg"
            alt="Portrait of Prasad Jawale"
            width={360}
            height={440}
            className="rounded-2xl shadow-md w-full max-w-[280px] sm:max-w-xs object-cover aspect-[4/5]"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default About;
