/**
 * Whether the home page includes the photography portfolio section.
 *
 * Set `NEXT_PUBLIC_INCLUDE_PHOTOGRAPHY=false` for recruiter-only deploys.
 *
 * @param envValue - Raw env value (defaults to `process.env` at build time).
 * @returns True when the photography section and nav item should render.
 */
export function includesPhotographySection(
  envValue: string | undefined = process.env.NEXT_PUBLIC_INCLUDE_PHOTOGRAPHY,
): boolean {
  return envValue !== "false";
}
