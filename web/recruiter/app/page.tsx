import HomeClient from "../components/HomeClient";
import { fetchGithubProjects } from "../lib/projects";

/**
 * Home page: loads featured projects and renders the client shell.
 *
 * @returns Server-rendered home page.
 */
export default async function Page() {
  const projects = await fetchGithubProjects();
  return <HomeClient projects={projects} />;
}
