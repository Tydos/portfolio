import { FEATURED_PROJECTS } from "../constants/featuredProjects";
import type { Project } from "../types";

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
} as const;

const REVALIDATE_SECONDS = 3600;

/**
 * Extract GitHub repository owner and name from a repository URL.
 *
 * @param url - Full GitHub repository URL.
 * @returns Owner and repo name, or `null` if the URL is invalid.
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
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
 * Fetches the ISO timestamp of the latest commit on the repo default branch.
 *
 * @param githubUrl - Repository URL (`https://github.com/{owner}/{repo}`).
 * @returns Committer date from the newest commit, or `null` when unavailable.
 */
export async function fetchLatestCommitDate(
  githubUrl: string,
): Promise<string | null> {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
    {
      headers: GITHUB_API_HEADERS,
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!res.ok) return null;

  const commits: unknown = await res.json();
  if (!Array.isArray(commits) || commits.length === 0) return null;

  const commit = commits[0] as {
    commit?: { committer?: { date?: string } };
  };
  const date = commit.commit?.committer?.date;
  return typeof date === "string" ? date : null;
}

/**
 * Sorts featured projects by latest GitHub commit date (newest first).
 *
 * @param projects - Curated projects with optional `github` URLs.
 * @returns Sorted copy; original catalog order breaks ties when dates missing.
 */
export async function sortProjectsByLatestCommit(
  projects: Project[],
): Promise<Project[]> {
  const dated = await Promise.all(
    projects.map(async (project, index) => {
      const commitDate = project.github
        ? await fetchLatestCommitDate(project.github)
        : null;
      return { project, commitDate, index };
    }),
  );

  return dated
    .sort((a, b) => {
      if (a.commitDate && b.commitDate) {
        const byDate = b.commitDate.localeCompare(a.commitDate);
        if (byDate !== 0) return byDate;
      } else if (a.commitDate) return -1;
      else if (b.commitDate) return 1;
      return a.index - b.index;
    })
    .map(({ project }) => project);
}

/**
 * Return curated featured projects sorted by latest GitHub commit (newest first).
 *
 * @returns Featured project list used by the home Projects section.
 */
export async function fetchGithubProjects(): Promise<Project[]> {
  return sortProjectsByLatestCommit(FEATURED_PROJECTS);
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
      next: { revalidate: REVALIDATE_SECONDS },
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
