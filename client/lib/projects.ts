import { GITHUB_USERNAME } from "../constants/config";
import type { Project, GithubRepo } from "../types";

/**
 * Converts a GitHub API repository object into internal Project format.
 *
 * @param repo - Repository object returned from the GitHub API
 * @returns Normalized Project object used by the application
 */
function repoToProject(repo: GithubRepo): Project {
  return {
    slug: repo.name,
    title: repo.name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? undefined,
    github: repo.html_url,
    link: repo.homepage || undefined,
    tags:
      repo.topics.length > 0
        ? repo.topics
        : repo.language
          ? [repo.language]
          : [],
    image: `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`,
  };
}

/**
 * Fetches all owned (non-fork) repositories for the configured GitHub user
 * and transforms them into Project objects.
 *
 * Results are sorted by last update and cached for 1 hour.
 *
 * @returns Array of Project objects, or an empty array on failure
 */
export async function fetchGithubProjects(): Promise<Project[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  const repos: GithubRepo[] = await res.json();

  return repos.filter((r) => !r.fork).map(repoToProject);
}

/**
 * Fetches a single GitHub repository by its slug and converts it into a Project.
 *
 * @param slug - Repository name (URL slug)
 * @returns Project object if found, otherwise null
 */
export async function fetchGithubProject(
  slug: string,
): Promise<Project | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${slug}`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return null;

  const repo: GithubRepo = await res.json();

  return repoToProject(repo);
}

/**
 * Extracts GitHub repository owner and name from a repository URL.
 *
 * @param url - Full GitHub repository URL
 * @returns Object containing owner and repo, or null if invalid
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
 * Fetches the raw README file from a GitHub repository.
 *
 * @param githubUrl - Full GitHub repository URL
 * @returns Raw README text or null if unavailable
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
 *
 * @param raw - Raw README markdown content
 * @returns Sanitized README string
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
