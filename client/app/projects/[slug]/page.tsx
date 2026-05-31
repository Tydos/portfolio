import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Code, ExternalLink } from "react-feather";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { fetchGithubProject, fetchGithubProjects } from "../../../lib/github";
import "highlight.js/styles/github-dark.css";

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

async function fetchReadme(githubUrl: string): Promise<string | null> {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: { Accept: "application/vnd.github.raw+json" },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return null;
  return res.text();
}

function cleanReadme(raw: string): string {
  return raw
    .split("\n")
    // Remove the first h1 (title duplicate)
    .filter((line, i, lines) => {
      if (/^#\s/.test(line)) {
        const prev = lines.slice(0, i).find((l) => l.trim() !== "");
        return prev !== undefined;
      }
      return true;
    })
    // Remove badge lines
    .filter((line) => !/^\[!\[/.test(line.trim()))
    // Remove lines that are only an image badge inline
    .filter((line) => !/^!\[.*?\]\(https?:\/\/.*?(badge|shield|img\.shields)/.test(line.trim()))
    .join("\n")
    // Collapse 3+ consecutive blank lines into 2
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-900 mt-10 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-3 pb-2 border-b border-slate-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-700 mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4 pl-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-slate-600 space-y-1 mb-4 pl-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-slate-500 my-4">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code className={className} {...props}>{children}</code>
    ) : (
      <code className="bg-slate-100 text-slate-800 text-xs font-mono px-1.5 py-0.5 rounded" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="rounded-xl overflow-x-auto text-sm my-6">{children}</pre>
  ),
  img: ({ src, alt }) =>
    src ? (
      <span className="block my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          className="rounded-xl max-w-full h-auto mx-auto shadow-sm"
        />
      </span>
    ) : null,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50 text-slate-700">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold border-b border-slate-200">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-b border-slate-100 text-slate-600">{children}</td>
  ),
  hr: () => <hr className="my-8 border-slate-100" />,
};

export async function generateStaticParams() {
  const projects = await fetchGithubProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchGithubProject(slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchGithubProject(slug);
  if (!project) notFound();

  const rawReadme = project.github ? await fetchReadme(project.github) : null;
  const readme = rawReadme ? cleanReadme(rawReadme) : null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-12"
        >
          <ArrowLeft size={15} />
          Back to projects
        </Link>

        {project.image && (
          <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-10 bg-slate-100">
            <Image src={project.image} alt={project.title} fill unoptimized className="object-cover" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">{project.title}</h1>

        {project.description && (
          <p className="text-slate-500 text-base mb-8 leading-relaxed">{project.description}</p>
        )}

        <div className="flex gap-3 mb-12">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Code size={14} />
              Source Code
            </a>
          )}
          {project.link && project.link !== project.github && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-400 text-slate-700 text-sm font-semibold rounded-full transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>

        {readme && (
          <div className="border-t border-slate-100 pt-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={mdComponents}
            >
              {readme}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </main>
  );
}
