import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_PHOTOGRAPHS } from "../../../constants/photographs";
import {
  parsePhotographPagination,
  queryPhotographsFromSupabase,
} from "../../../lib/photographsQuery";
import { isSupabaseReadConfigured } from "../../../lib/supabaseRead";

const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePhotographPagination(
    searchParams.get("limit"),
    searchParams.get("offset"),
  );

  if (isSupabaseReadConfigured()) {
    const supabaseResult = await queryPhotographsFromSupabase(limit, offset);
    if (supabaseResult !== null) {
      return NextResponse.json(supabaseResult);
    }

    return NextResponse.json(
      { error: "Failed to read photographs from Supabase." },
      { status: 503 },
    );
  }

  const query = searchParams.toString();
  const backendUrl = query
    ? `${BACKEND_URL}/images?${query}`
    : `${BACKEND_URL}/images`;

  try {
    const res = await fetch(backendUrl, {
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });

    if (res.ok) {
      return NextResponse.json(await res.json());
    }
  } catch {
    // FastAPI backend not running — serve static fallback below.
  }

  return NextResponse.json(FALLBACK_PHOTOGRAPHS);
}
