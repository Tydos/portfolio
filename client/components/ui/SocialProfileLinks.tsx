import {
  getOrderedSocialLinks,
  HERO_SOCIAL_LABELS,
  SOCIAL_LINK_ICONS,
  type SocialLinkLabel,
} from "./socialLinkIcons";

const linkClassName =
  "inline-flex items-center gap-1.5 min-h-[44px] px-2 py-1 text-xs sm:text-sm font-medium text-ink-muted hover:text-accent rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors";

interface SocialProfileLinksProps {
  /** Platform order; defaults to {@link HERO_SOCIAL_LABELS}. */
  labels?: readonly SocialLinkLabel[];
  /** Extra classes on the wrapping `<nav>`. */
  className?: string;
  /** Extra classes on the link list (`<ul>`). */
  listClassName?: string;
}

/**
 * Compact external profile links (small brand icon + platform name).
 *
 * @param props.labels - Which platforms to show and in what order.
 * @param props.className - Nav wrapper classes.
 * @param props.listClassName - List layout classes.
 */
function SocialProfileLinks({
  labels = HERO_SOCIAL_LABELS,
  className = "",
  listClassName = "flex flex-wrap gap-x-4 gap-y-2",
}: SocialProfileLinksProps) {
  const links = getOrderedSocialLinks(labels);

  return (
    <nav aria-label="Social profiles" className={className}>
      <ul className={listClassName}>
        {links.map(({ href, label }) => {
          const Icon = SOCIAL_LINK_ICONS[label];
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SocialProfileLinks;
