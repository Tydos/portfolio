import { createSupabaseReadClient, isSupabaseReadConfigured } from "./supabaseRead";

/** Row shape returned from the `photographs` table for gallery reads. */
export interface PhotographRow {
  id: number;
  filename: string;
  url: string;
  category: string;
  width: number;
  height: number;
}

/** Paginated photograph query result. */
export interface PhotographsQueryResult {
  photos: PhotographRow[];
  total: number;
}

/**
 * Parse and clamp photograph list pagination query params.
 *
 * @param limitParam - Raw `limit` query string (defaults to 25, clamped 1–100).
 * @param offsetParam - Raw `offset` query string (defaults to 0, min 0).
 * @returns Sanitized `limit` and `offset` for the database query.
 */
export function parsePhotographPagination(
  limitParam: string | null,
  offsetParam: string | null,
): { limit: number; offset: number } {
  const limit = Math.min(100, Math.max(1, Number(limitParam) || 25));
  const offset = Math.max(0, Number(offsetParam) || 0);
  return { limit, offset };
}

/**
 * Read paginated photograph rows from Supabase (server-side only).
 *
 * @param limit - Maximum number of rows to return (1–100 at the API layer).
 * @param offset - Number of rows to skip.
 * @returns Paginated rows and total count; `null` when Supabase is
 *     unconfigured, the client cannot be created, or the query errors.
 *     Configured empty tables return `{ photos: [], total: 0 }`.
 */
export async function queryPhotographsFromSupabase(
  limit: number,
  offset: number,
): Promise<PhotographsQueryResult | null> {
  if (!isSupabaseReadConfigured()) {
    return null;
  }

  const supabase = createSupabaseReadClient();
  if (!supabase) {
    return null;
  }

  const from = offset;
  const to = offset + limit - 1;

  const { data, error, count } = await supabase
    .from("photographs")
    .select("id, filename, url, category, width, height", { count: "exact" })
    .order("id")
    .range(from, to);

  if (error) {
    console.warn("queryPhotographsFromSupabase:", error.message);
    return null;
  }

  return {
    photos: (data ?? []) as PhotographRow[],
    total: count ?? 0,
  };
}
