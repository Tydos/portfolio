import type { MetadataRoute } from "next";
import { INCLUDE_PHOTOGRAPHY } from "../constants/config";
import { PHOTOGRAPHY_CANONICAL_PATH } from "../constants/photographySeo";
import { absoluteSiteUrl } from "../lib/siteUrl";

/**
 * Sitemap entries for indexable public routes.
 *
 * @returns Sitemap consumed by crawlers at `/sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteSiteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (INCLUDE_PHOTOGRAPHY) {
    entries.push({
      url: absoluteSiteUrl(PHOTOGRAPHY_CANONICAL_PATH),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
