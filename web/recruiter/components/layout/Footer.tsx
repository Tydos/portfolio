import SocialLinks from "../ui/SocialLinks";
import { PHOTOGRAPHY_SITE_URL } from "../../constants/config";

/** Site footer with copyright, photography link, and social icons. */
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-ink-muted text-sm">
          &copy; {new Date().getFullYear()} Prasad Jawale
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href={PHOTOGRAPHY_SITE_URL}
            className="text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
          >
            Photography portfolio
          </a>
          <SocialLinks variant="icons" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
