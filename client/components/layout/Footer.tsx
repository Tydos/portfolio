import SocialProfileLinks from "../ui/SocialProfileLinks";

/** Site footer with copyright and social profile links. */
function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-ink-muted text-sm">
          &copy; {new Date().getFullYear()} Prasad Jawale
        </p>
        <SocialProfileLinks listClassName="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2" />
      </div>
    </footer>
  );
}

export default Footer;
