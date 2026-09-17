import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "../lib/siteUrl";

/**
 * Robots rules: allow indexing and point crawlers at the sitemap.
 *
 * @returns Robots metadata served at `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
