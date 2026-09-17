import type { Metadata } from "next";
import StructuredData from "../components/StructuredData";
import HomeClient from "../components/HomeClient";
import { SITE } from "../constants/config";
import { fetchGithubProjects } from "../lib/projects";
import { absoluteSiteUrl } from "../lib/siteUrl";

const homeCanonical = absoluteSiteUrl("/");

/** Home page metadata and social preview (recruiter-first). */
export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: homeCanonical },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: homeCanonical,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 360,
        height: 440,
        alt: "Portrait of Prasad Jawale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
};

/**
 * Home page: loads featured projects and renders the client shell.
 *
 * @returns Server-rendered home page.
 */
export default async function Page() {
  const projects = await fetchGithubProjects();
  return (
    <>
      <StructuredData page="home" />
      <HomeClient projects={projects} />
    </>
  );
}
