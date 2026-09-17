/**
 * Resolves the public site origin for canonical URLs and sitemap entries.
 *
 * @returns Origin without a trailing slash (`NEXT_PUBLIC_SITE_URL`, then
 *     `VERCEL_URL`, else local dev).
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return raw.replace(/\/$/, "");
}

/**
 * Builds an absolute URL for a path on this site.
 *
 * @param path - Path beginning with `/` (e.g. `/portfolio`).
 * @returns Absolute URL using {@link getSiteUrl}.
 */
export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
