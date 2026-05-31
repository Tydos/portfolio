import { GITHUB_USERNAME } from "../constants/config";
import type { Project } from "../types";

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  language: string | null;
}

function repoToProject(repo: GithubRepo): Project {
  return {
    slug: repo.name,
    title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? undefined,
    github: repo.html_url,
    link: repo.homepage || undefined,
    tags: repo.topics.length > 0 ? repo.topics : repo.language ? [repo.language] : [],
    image: `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`,
  };
}

export async function fetchGithubProjects(): Promise<Project[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const repos: GithubRepo[] = await res.json();
  return repos.filter((r) => !r.fork).map(repoToProject);
}

export async function fetchGithubProject(slug: string): Promise<Project | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${slug}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const repo: GithubRepo = await res.json();
  return repoToProject(repo);
}
