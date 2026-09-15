import type { Project, ProjectCategory } from "../types";

/** Active filter, including show-all. */
export type ProjectFilterId = "all" | ProjectCategory;

/** Filter pills shown above the home Projects list. */
export const PROJECT_FILTER_OPTIONS: { id: ProjectFilterId; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "aiml", label: "AIML" },
    { id: "swe", label: "SWE" },
    { id: "android", label: "Android" },
    { id: "mlops", label: "MLOps" },
  ];

/**
 * Returns projects matching the selected category filter.
 *
 * @param projects - Curated featured projects in display order.
 * @param filterId - Active filter pill id.
 * @returns Projects whose `categories` include the filter, or all when `all`.
 */
export function filterProjectsByCategory(
  projects: Project[],
  filterId: ProjectFilterId,
): Project[] {
  if (filterId === "all") return projects;
  return projects.filter((project) => project.categories?.includes(filterId));
}
