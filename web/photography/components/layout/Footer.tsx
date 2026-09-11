/** Minimal footer. */
function Footer() {
  return (
    <footer className="py-8 px-6 bg-wired-black text-white/60 border-t border-white/10">
      <p className="text-center text-xs">
        &copy; {new Date().getFullYear()} Prasad Jawale
      </p>
    </footer>
  );
}

export default Footer;
