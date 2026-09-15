import { describe, it, expect, vi, afterEach } from "vitest";
import {
  cleanReadme,
  fetchGithubProject,
  fetchGithubProjects,
  fetchLatestCommitDate,
  fetchReadme,
  parseGithubUrl,
  sortProjectsByLatestCommit,
} from "./projects";
import { FEATURED_PROJECTS } from "../constants/featuredProjects";
import type { Project } from "../types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockCommitDates(datesByRepo: Record<string, string>) {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      const match = url.match(/repos\/([^/]+)\/([^/]+)\/commits/);
      if (!match) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      const key = `${match[1]}/${match[2]}`;
      const date = datesByRepo[key];
      if (!date) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [{ commit: { committer: { date } } }],
      });
    }),
  );
}

describe("parseGithubUrl", () => {
  it("parses owner and repo from a GitHub URL", () => {
    expect(parseGithubUrl("https://github.com/Tydos/portfolio")).toEqual({
      owner: "Tydos",
      repo: "portfolio",
    });
  });
});

describe("fetchLatestCommitDate", () => {
  it("returns the latest committer date", async () => {
    mockCommitDates({ "Tydos/portfolio": "2026-03-15T12:00:00Z" });
    await expect(
      fetchLatestCommitDate("https://github.com/Tydos/portfolio"),
    ).resolves.toBe("2026-03-15T12:00:00Z");
  });

  it("returns null for invalid URLs", async () => {
    await expect(fetchLatestCommitDate("not-a-url")).resolves.toBeNull();
  });
});

describe("sortProjectsByLatestCommit", () => {
  it("orders projects by GitHub commit date descending", async () => {
    const projects: Project[] = [
      {
        slug: "old",
        title: "Old",
        tags: [],
        categories: ["swe"],
        github: "https://github.com/Tydos/old",
      },
      {
        slug: "new",
        title: "New",
        tags: [],
        categories: ["swe"],
        github: "https://github.com/Tydos/new",
      },
    ];
    mockCommitDates({
      "Tydos/old": "2023-01-01T00:00:00Z",
      "Tydos/new": "2026-01-01T00:00:00Z",
    });

    const sorted = await sortProjectsByLatestCommit(projects);
    expect(sorted.map((p) => p.slug)).toEqual(["new", "old"]);
  });
});

describe("fetchGithubProjects", () => {
  it("returns featured projects sorted by latest commit when GitHub responds", async () => {
    mockCommitDates({
      "Tydos/portfolio": "2026-03-01T00:00:00Z",
      "Tydos/GPT-2": "2025-06-01T00:00:00Z",
    });

    const projects = await fetchGithubProjects();
    expect(projects.length).toBe(FEATURED_PROJECTS.length);

    const portfolioIndex = projects.findIndex((p) => p.slug === "portfolio-website");
    const gptIndex = projects.findIndex((p) => p.slug === "gpt-2");
    expect(portfolioIndex).toBeGreaterThanOrEqual(0);
    expect(gptIndex).toBeGreaterThanOrEqual(0);
    expect(portfolioIndex).toBeLessThan(gptIndex);
  });
});

describe("fetchGithubProject", () => {
  it("returns a project by slug", async () => {
    mockCommitDates({});
    const found = await fetchGithubProject("portfolio-website");
    expect(found?.slug).toBe("portfolio-website");
  });

  it("returns null for unknown slug", async () => {
    expect(await fetchGithubProject("not-a-real-project")).toBeNull();
  });
});

describe("fetchReadme", () => {
  it("returns null for invalid GitHub URLs", async () => {
    expect(await fetchReadme("not-a-url")).toBeNull();
    expect(await fetchReadme("https://example.com/no-repo")).toBeNull();
  });

  it("fetches raw README markdown from GitHub", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "# Hello\n\nBody",
    });
    vi.stubGlobal("fetch", fetchMock);

    const markdown = await fetchReadme("https://github.com/Tydos/portfolio");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/Tydos/portfolio/readme",
      expect.objectContaining({
        headers: { Accept: "application/vnd.github.raw+json" },
      }),
    );
    expect(markdown).toBe("# Hello\n\nBody");
  });

  it("returns null when GitHub responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    expect(await fetchReadme("https://github.com/Tydos/missing")).toBeNull();
  });
});

describe("cleanReadme", () => {
  it("strips badges, drops leading H1, and normalizes breaks", () => {
    const raw = [
      "# Title",
      "",
      "[![CI](https://img.shields.io/badge/ci-pass)](https://example.com)",
      "![badge](https://img.shields.io/badge/build-ok)",
      "# Later heading",
      "Paragraph<br/>next",
      "",
      "",
      "",
      "End",
    ].join("\n");

    const cleaned = cleanReadme(raw);

    expect(cleaned).not.toContain("shields.io");
    expect(cleaned.startsWith("# Title")).toBe(false);
    expect(cleaned).toContain("# Later heading");
    expect(cleaned).toContain("Paragraph\nnext");
    expect(cleaned).not.toMatch(/\n{3,}/);
    expect(cleaned.endsWith("End")).toBe(true);
  });
});
