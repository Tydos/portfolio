import { FEATURED_PROJECTS } from "../constants/featuredProjects";
import type { Project } from "../types";

/**
 * Extract GitHub repository owner and name from a repository URL.
 *
 * @param url - Full GitHub repository URL.
 * @returns Owner and repo name, or `null` if the URL is invalid.
 */
function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const { pathname } = new URL(url);
    const [, owner, repo] = pathname.split("/");

    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}

/**
 * Return curated featured projects in display order.
 *
 * @returns Featured project list used by the home Projects section.
 */
export async function fetchGithubProjects(): Promise<Project[]> {
  return FEATURED_PROJECTS;
}

/**
 * Return a curated project by slug, or null if it is not featured.
 *
 * @param slug - Project URL slug.
 * @returns Matching project, or `null` when the slug is unknown.
 */
export async function fetchGithubProject(
  slug: string,
): Promise<Project | null> {
  return FEATURED_PROJECTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Fetch the raw README markdown for a GitHub repository.
 *
 * @param githubUrl - Repository URL (`https://github.com/{owner}/{repo}`).
 * @returns README markdown text, or `null` when the URL is invalid or GitHub
 *     returns a non-OK response.
 */
export async function fetchReadme(githubUrl: string): Promise<string | null> {
  const parsed = parseGithubUrl(githubUrl);

  if (!parsed) return null;

  const { owner, repo } = parsed;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: { Accept: "application/vnd.github.raw+json" },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return null;

  return res.text();
}

/**
 * Clean raw README markdown for project detail pages.
 *
 * Removes duplicate title headers, badge/shield image lines, and inline badge
 * images; converts HTML breaks to newlines; collapses excessive blank lines.
 *
 * @param raw - Raw README markdown from GitHub.
 * @returns Cleaned markdown suitable for MDX rendering.
 */
export function cleanReadme(raw: string): string {
  return (
    raw
      .split("\n")

      // Remove duplicate H1 title if it's repeated later in the file
      .filter((line, i, lines) => {
        if (/^#\s/.test(line)) {
          const prev = lines.slice(0, i).find((l) => l.trim() !== "");
          return prev !== undefined;
        }
        return true;
      })

      // Remove badge-style markdown lines
      .filter((line) => !/^\[!\[/.test(line.trim()))

      // Remove inline badge/shield images
      .filter(
        (line) =>
          !/^!\[.*?\]\(https?:\/\/.*?(badge|shield|img\.shields)/.test(
            line.trim(),
          ),
      )

      .join("\n")

      // Normalize HTML breaks
      .replace(/<br\s*\/?>/gi, "\n")

      // Collapse excessive blank lines
      .replace(/\n{3,}/g, "\n\n")

      .trim()
  );
}
