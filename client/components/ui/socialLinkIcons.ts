import type { ComponentType } from "react";
import { SOCIAL_LINKS } from "../../constants/config";
import CodeChefIcon from "./CodeChefIcon";
import GitHubIcon from "./GitHubIcon";
import KaggleIcon from "./KaggleIcon";
import LeetCodeIcon from "./LeetCodeIcon";
import LinkedInIcon from "./LinkedInIcon";

/** Labels from {@link SOCIAL_LINKS}. */
export type SocialLinkLabel = (typeof SOCIAL_LINKS)[number]["label"];

type SocialIconProps = {
  size?: number;
  className?: string;
};

/** Brand / platform icons keyed by social link label. */
export const SOCIAL_LINK_ICONS: Record<
  SocialLinkLabel,
  ComponentType<SocialIconProps>
> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  LeetCode: LeetCodeIcon,
  CodeChef: CodeChefIcon,
  Kaggle: KaggleIcon,
};

/** Default display order (recruiter-first, then competitive programming). */
export const HERO_SOCIAL_LABELS: SocialLinkLabel[] = [
  "LinkedIn",
  "GitHub",
  "LeetCode",
  "CodeChef",
  "Kaggle",
];

/**
 * Returns configured social links in the requested label order.
 *
 * @param labels - Platform labels to include; unknown labels are skipped.
 * @returns Matching entries from {@link SOCIAL_LINKS}.
 */
export function getOrderedSocialLinks(
  labels: readonly SocialLinkLabel[] = HERO_SOCIAL_LABELS,
): Array<(typeof SOCIAL_LINKS)[number]> {
  return labels
    .map((label) => SOCIAL_LINKS.find((item) => item.label === label))
    .filter((item): item is (typeof SOCIAL_LINKS)[number] => item != null);
}
