import { Linkedin } from "react-feather";
import GitHubIcon from "./GitHubIcon";
import { SOCIAL_LINKS } from "../../constants/config";

const ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: Linkedin,
} as const;

interface SocialLinksProps {
  variant?: "icons" | "pills";
}

function SocialLinks({ variant = "pills" }: SocialLinksProps) {
  return (
    <div
      className={
        variant === "icons"
          ? "flex items-center gap-4"
          : "flex flex-wrap items-center justify-center gap-3"
      }
    >
      {SOCIAL_LINKS.map(({ href, label }) => {
        const Icon = ICONS[label];
        const iconSize = variant === "icons" ? 22 : 18;

        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${label} profile`}
            className={
              variant === "icons"
                ? "text-ink-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded transition-colors p-1"
                : "inline-flex items-center gap-2.5 px-5 py-2.5 min-h-[44px] rounded-full border border-slate-200 bg-white text-ink hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors text-sm font-medium"
            }
          >
            <Icon size={iconSize} />
            {variant === "pills" && label}
          </a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
