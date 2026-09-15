import { ArrowDown } from "react-feather";
import EditorialHeroCarousel from "./EditorialHeroCarousel";

/** Portfolio page splash hero. */
function EditorialHero() {
  return (
    <EditorialHeroCarousel
      size="page"
      sectionId="top"
      cta={
        <a
          href="#gallery"
          className="inline-flex items-center gap-2 px-6 py-3 bg-wired-yellow text-wired-black text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
        >
          Full gallery
          <ArrowDown size={16} aria-hidden="true" />
        </a>
      }
    />
  );
}

export default EditorialHero;
