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

const photographColumns = "id, filename, url, category, width, height";

/**
 * Fetch a small set of hero photographs by id or category.
 *
 * @param options.categories - Supabase category labels to include.
 * @param options.photoIds - When non-empty, fetch only these ids (preserves order).
 * @param options.limit - Maximum rows when filtering by category.
 * @returns Matching rows, or `null` when unconfigured or the query fails.
 */
export async function queryHeroFeaturedPhotographs(options: {
  categories: readonly string[];
  photoIds: readonly number[];
  limit: number;
}): Promise<PhotographRow[] | null> {
  if (!isSupabaseReadConfigured()) {
    return null;
  }

  const supabase = createSupabaseReadClient();
  if (!supabase) {
    return null;
  }

  const { categories, photoIds, limit } = options;
  const cappedLimit = Math.min(12, Math.max(1, limit));

  if (photoIds.length > 0) {
    const { data, error } = await supabase
      .from("photographs")
      .select(photographColumns)
      .in("id", [...photoIds]);

    if (error) {
      console.warn("queryHeroFeaturedPhotographs:", error.message);
      return null;
    }

    const rows = (data ?? []) as PhotographRow[];
    const byId = new Map(rows.map((row) => [row.id, row]));
    return photoIds
      .map((id) => byId.get(id))
      .filter((row): row is PhotographRow => row !== undefined);
  }

  if (categories.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("photographs")
    .select(photographColumns)
    .in("category", [...categories])
    .order("id", { ascending: false })
    .limit(cappedLimit);

  if (error) {
    console.warn("queryHeroFeaturedPhotographs:", error.message);
    return null;
  }

  return (data ?? []) as PhotographRow[];
}
