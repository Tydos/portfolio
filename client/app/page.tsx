import HomeClient from '../components/HomeClient';
import { fetchGithubProjects } from '../lib/github';

export default async function Page() {
  const projects = await fetchGithubProjects();
  return <HomeClient projects={projects} />;
}
