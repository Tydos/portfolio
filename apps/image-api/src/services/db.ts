import pg from "pg";
import type { Photo } from "@portfolio/shared-types";
import { config } from "../config";

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

function rowToPhoto(row: pg.QueryResultRow): Photo {
  return {
    id: row.id,
    filename: row.filename,
    category: row.category,
    width: row.width,
    height: row.height,
    size_bytes_input: row.size_bytes_input,
    size_bytes_optimized: row.size_bytes_optimized,
    cdn_url_thumb: row.cdn_url_thumb,
    cdn_url_medium: row.cdn_url_medium,
    cdn_url_original: row.cdn_url_original,
    created_at: row.created_at?.toISOString?.() ?? row.created_at,
  };
}

export async function pingDb(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function getUserByGithub(
  githubUsername: string,
): Promise<{ id: number; role: string } | null> {
  const { rows } = await pool.query(
    "SELECT id, role FROM users WHERE github_username = $1",
    [githubUsername],
  );
  return rows[0] ?? null;
}

export async function upsertUser(
  githubUsername: string,
  role: "viewer" | "admin" = "viewer",
): Promise<{ id: number; role: string }> {
  const { rows } = await pool.query(
    `INSERT INTO users (github_username, role)
     VALUES ($1, $2)
     ON CONFLICT (github_username) DO UPDATE SET github_username = EXCLUDED.github_username
     RETURNING id, role`,
    [githubUsername, role],
  );
  return rows[0];
}

export interface InsertPhotoInput {
  filename: string;
  category: string;
  width: number;
  height: number;
  sizeBytesInput: number;
  sizeBytesOptimized: number;
  s3KeyOriginal: string;
  s3KeyThumb: string;
  s3KeyMedium: string;
  cdnUrlOriginal: string;
  cdnUrlThumb: string;
  cdnUrlMedium: string;
  uploadedBy?: number;
}

export async function insertPhoto(input: InsertPhotoInput): Promise<Photo> {
  const { rows } = await pool.query(
    `INSERT INTO photographs (
      filename, category, width, height,
      size_bytes_input, size_bytes_optimized,
      s3_key_original, s3_key_thumb, s3_key_medium,
      cdn_url_original, cdn_url_thumb, cdn_url_medium,
      uploaded_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    [
      input.filename,
      input.category,
      input.width,
      input.height,
      input.sizeBytesInput,
      input.sizeBytesOptimized,
      input.s3KeyOriginal,
      input.s3KeyThumb,
      input.s3KeyMedium,
      input.cdnUrlOriginal,
      input.cdnUrlThumb,
      input.cdnUrlMedium,
      input.uploadedBy ?? null,
    ],
  );
  return rowToPhoto(rows[0]);
}

export async function fetchPhotos(
  limit: number,
  offset: number,
  category?: string | null,
): Promise<{ data: Photo[]; total: number }> {
  const params: unknown[] = [limit, offset];
  let where = "";
  if (category) {
    where = "WHERE category = $3";
    params.push(category);
  }

  const countQuery = category
    ? "SELECT COUNT(*)::int AS total FROM photographs WHERE category = $1"
    : "SELECT COUNT(*)::int AS total FROM photographs";
  const countParams = category ? [category] : [];

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery, countParams),
    pool.query(
      `SELECT id, filename, category, width, height,
              size_bytes_input, size_bytes_optimized,
              cdn_url_thumb, cdn_url_medium, cdn_url_original, created_at
       FROM photographs
       ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    ),
  ]);

  return {
    data: dataResult.rows.map(rowToPhoto),
    total: countResult.rows[0].total,
  };
}

export async function getPhotoById(id: number): Promise<Photo | null> {
  const { rows } = await pool.query(
    "SELECT * FROM photographs WHERE id = $1",
    [id],
  );
  return rows[0] ? rowToPhoto(rows[0]) : null;
}

export async function deletePhoto(id: number): Promise<string[]> {
  const { rows } = await pool.query(
    "DELETE FROM photographs WHERE id = $1 RETURNING s3_key_original, s3_key_thumb, s3_key_medium",
    [id],
  );
  if (!rows[0]) throw new Error("Photo not found");
  return [rows[0].s3_key_original, rows[0].s3_key_thumb, rows[0].s3_key_medium];
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export { pool };
