"use client";

import Link from "next/link";
import { ArrowRight } from "react-feather";
import { Anton } from "next/font/google";
import EditorialHeroCarousel from "../photography/sections/EditorialHeroCarousel";
import { PORTFOLIO_PATH } from "../../constants/config";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Home-page photography teaser mirroring the portfolio editorial hero.
 */
function PortfolioTeaser() {
  return (
    <div
      className={`photo-theme ${display.variable} max-w-7xl mx-auto px-4 sm:px-6 selection:bg-wired-black selection:text-wired-yellow`}
    >
      <EditorialHeroCarousel
        size="teaser"
        className="border-b-0 shadow-lg"
        cta={
          <Link
            href={PORTFOLIO_PATH}
            className="inline-flex items-center gap-2 px-6 py-3 bg-wired-yellow text-wired-black text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wired-yellow"
          >
            Full gallery
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      />
    </div>
  );
}

export default PortfolioTeaser;
