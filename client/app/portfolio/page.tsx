import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StructuredData from "../../components/StructuredData";
import PortfolioPageClient from "../../components/PortfolioPageClient";
import { INCLUDE_PHOTOGRAPHY } from "../../constants/config";
import {
  PHOTOGRAPHY_PAGE_DESCRIPTION,
  PHOTOGRAPHY_PAGE_TITLE,
  photographyCanonicalUrl,
} from "../../constants/photographySeo";
import { resolvePhotographyShareImage } from "../../lib/photographyShareImage";

/**
 * Photography gallery metadata: title, description, canonical, and social cards.
 *
 * @returns Next.js metadata for `/portfolio`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const canonical = photographyCanonicalUrl();
  const image = await resolvePhotographyShareImage();

  return {
    title: { absolute: PHOTOGRAPHY_PAGE_TITLE },
    description: PHOTOGRAPHY_PAGE_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      title: PHOTOGRAPHY_PAGE_TITLE,
      description: PHOTOGRAPHY_PAGE_DESCRIPTION,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: PHOTOGRAPHY_PAGE_TITLE,
      description: PHOTOGRAPHY_PAGE_DESCRIPTION,
      images: [image.url],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Dedicated photography gallery page.
 *
 * @returns Portfolio page or 404 when photography is disabled.
 */
export default function PortfolioPage() {
  if (!INCLUDE_PHOTOGRAPHY) {
    notFound();
  }

  return (
    <>
      <StructuredData page="photography" />
      <PortfolioPageClient />
    </>
  );
}
