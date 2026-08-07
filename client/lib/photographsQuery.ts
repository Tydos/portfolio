import { createSupabaseReadClient, isSupabaseReadConfigured } from "./supabaseRead";

export interface PhotographRow {
  id: number;
  filename: string;
  url: string;
  category: string;
  width: number;
  height: number;
}

export interface PhotographsQueryResult {
  photos: PhotographRow[];
  total: number;
}

export function parsePhotographPagination(
  limitParam: string | null,
  offsetParam: string | null,
): { limit: number; offset: number } {
  const limit = Math.min(100, Math.max(1, Number(limitParam) || 25));
  const offset = Math.max(0, Number(offsetParam) || 0);
  return { limit, offset };
}

/**
 * Reads paginated rows from Supabase (server-side).
 * Returns null when unconfigured; empty `{ photos: [], total: 0 }` when configured but no rows.
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
