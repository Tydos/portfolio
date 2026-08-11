import { describe, it, expect, vi, afterEach } from "vitest";
import {
  cleanReadme,
  fetchGithubProject,
  fetchGithubProjects,
  fetchReadme,
} from "./projects";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchGithubProjects", () => {
  it("returns curated featured projects", async () => {
    const projects = await fetchGithubProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      tags: expect.any(Array),
    });
  });
});

describe("fetchGithubProject", () => {
  it("returns a project by slug", async () => {
    const projects = await fetchGithubProjects();
    const slug = projects[0].slug;
    const found = await fetchGithubProject(slug);
    expect(found?.slug).toBe(slug);
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
