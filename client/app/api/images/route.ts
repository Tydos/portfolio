import { NextRequest, NextResponse } from "next/server";
import {
  parsePhotographPagination,
  queryPhotographsFromSupabase,
} from "../../../lib/photographsQuery";
import { isSupabaseReadConfigured } from "../../../lib/supabaseRead";

/**
 * Public gallery images proxy: paginated rows from Supabase.
 *
 * Query params: `limit` (1–100, default 25) and `offset` (>= 0, default 0).
 *
 * @param request - Incoming Next.js request with pagination search params.
 * @returns JSON `{ photos, total }` on success, or 503 when Supabase is
 *     unconfigured or the query fails.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePhotographPagination(
    searchParams.get("limit"),
    searchParams.get("offset"),
  );

  if (!isSupabaseReadConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const supabaseResult = await queryPhotographsFromSupabase(limit, offset);
  if (supabaseResult !== null) {
    return NextResponse.json(supabaseResult);
  }

  return NextResponse.json(
    { error: "Failed to read photographs from Supabase." },
    { status: 503 },
  );
}
