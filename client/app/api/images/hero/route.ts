import { NextResponse } from "next/server";
import { PORTFOLIO_HERO_NATURE } from "../../../../constants/portfolioHero";
import { queryHeroFeaturedPhotographs } from "../../../../lib/photographsQuery";
import { isSupabaseReadConfigured } from "../../../../lib/supabaseRead";

/**
 * Public hero splash images: curated nature (or fixed ids) from Supabase.
 *
 * @returns JSON `{ photos }` with photograph rows for the portfolio splash.
 */
export async function GET() {
  if (!isSupabaseReadConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const rows = await queryHeroFeaturedPhotographs({
    categories: PORTFOLIO_HERO_NATURE.categories,
    photoIds: PORTFOLIO_HERO_NATURE.photoIds,
    limit: PORTFOLIO_HERO_NATURE.limit,
  });

  if (rows === null) {
    return NextResponse.json(
      { error: "Failed to read hero photographs from Supabase." },
      { status: 503 },
    );
  }

  return NextResponse.json({ photos: rows });
}
