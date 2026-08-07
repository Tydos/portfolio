import SocialLinks from "../ui/SocialLinks";

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-ink-muted text-sm">
          &copy; {new Date().getFullYear()} Prasad Jawale
        </p>
        <SocialLinks variant="icons" />
      </div>
    </footer>
  );
}

export default Footer;
