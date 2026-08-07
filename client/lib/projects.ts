import { FEATURED_PROJECTS } from "../constants/featuredProjects";
import type { Project } from "../types";

/**
 * Extracts GitHub repository owner and name from a repository URL.
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
 * Returns curated featured projects in display order.
 */
export async function fetchGithubProjects(): Promise<Project[]> {
  return FEATURED_PROJECTS;
}

/**
 * Returns a curated project by slug, or null if not featured.
 */
export async function fetchGithubProject(
  slug: string,
): Promise<Project | null> {
  return FEATURED_PROJECTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Fetches the raw README file from a GitHub repository.
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
 * Cleans raw README markdown by:
 * - Removing duplicate title headers
 * - Stripping badge/shield image lines
 * - Removing inline badge images
 * - Converting HTML breaks to newlines
 * - Collapsing excessive blank lines
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
