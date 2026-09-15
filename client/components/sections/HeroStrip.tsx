import Image from "next/image";
import { HERO, SITE } from "../../constants/config";
import SocialProfileLinks from "../ui/SocialProfileLinks";

/** Slim identity bar directly under the nav; leads into resume content. */
function HeroStrip() {
  return (
    <header className="max-w-6xl mx-auto py-6 md:py-8 mb-8 md:mb-10 border-b border-slate-100">
      <div className="flex items-start gap-4 sm:gap-6 min-w-0">
        <Image
          src={SITE.ogImage}
          alt="Portrait of Prasad Jawale"
          width={96}
          height={96}
          className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover shrink-0 shadow-md"
          priority
        />
        <div className="min-w-0">
          <h1 className="text-display font-semibold text-ink leading-tight">
            {HERO.name}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-ink-muted leading-snug">
            {HERO.role}
          </p>
          <p className="text-xs text-ink-muted leading-relaxed mt-2 max-w-3xl">
            {HERO.proof}
          </p>
          <SocialProfileLinks className="mt-2" />
        </div>
      </div>
    </header>
  );
}

export default HeroStrip;
