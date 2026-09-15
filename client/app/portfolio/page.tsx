import { notFound } from "next/navigation";
import PortfolioPageClient from "../../components/PortfolioPageClient";
import { INCLUDE_PHOTOGRAPHY } from "../../constants/config";

/** Metadata for the photography portfolio page. */
export const metadata = {
  title: "Portfolio",
  description:
    "Photography portfolio by Prasad Jawale — nature and travel work.",
};

/**
 * Dedicated photography gallery page.
 *
 * @returns Portfolio page or 404 when photography is disabled.
 */
export default function PortfolioPage() {
  if (!INCLUDE_PHOTOGRAPHY) {
    notFound();
  }

  return <PortfolioPageClient />;
}
