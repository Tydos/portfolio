/**
 * Seeds photograph metadata. With --upload flag, also uploads sample images to S3.
 * Usage: npm run seed -w @portfolio/image-api -- [--count=100] [--upload]
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { config } from "../src/config";
import pg from "pg";
import { ensureBucket, getCdnUrl, uploadObject } from "../src/services/s3";
import { processImage } from "../src/services/sharp";

const count = parseInt(
  process.argv.find((a) => a.startsWith("--count="))?.split("=")[1] ?? "100",
  10,
);
const doUpload = process.argv.includes("--upload");

async function main() {
  const client = new pg.Client({ connectionString: config.databaseUrl });
  await client.connect();

  if (doUpload) await ensureBucket();

  console.log(`Seeding ${count} photographs...`);

  for (let i = 0; i < count; i++) {
    const filename = `seed_${Date.now()}_${i}.jpg`;
    const baseKey = filename.replace(/\.jpg$/, "");
    const category = ["nature", "landscape", "urban", "aero"][i % 4];

    let width = 1600;
    let height = 1200;
    let sizeInput = 500000;
    let sizeOptimized = 200000;
    let s3Original = `${baseKey}/original.jpg`;
    let s3Thumb = `${baseKey}/thumb.webp`;
    let s3Medium = `${baseKey}/medium.webp`;

    if (doUpload) {
      const buf = await sharp({
        create: {
          width: 1600 + (i % 500),
          height: 1200 + (i % 300),
          channels: 3,
          background: {
            r: (i * 17) % 255,
            g: (i * 31) % 255,
            b: (i * 47) % 255,
          },
        },
      })
        .jpeg({ quality: 90 })
        .toBuffer();

      const processed = await processImage(buf, baseKey);
      width = processed.original.width;
      height = processed.original.height;
      sizeInput = processed.inputBytes;
      sizeOptimized =
        processed.original.bytes +
        processed.medium.bytes +
        processed.thumb.bytes;

      await Promise.all([
        uploadObject(
          processed.original.s3Key,
          processed.original.buffer,
          processed.original.contentType,
        ),
        uploadObject(
          processed.medium.s3Key,
          processed.medium.buffer,
          processed.medium.contentType,
        ),
        uploadObject(
          processed.thumb.s3Key,
          processed.thumb.buffer,
          processed.thumb.contentType,
        ),
      ]);

      s3Original = processed.original.s3Key;
      s3Thumb = processed.thumb.s3Key;
      s3Medium = processed.medium.s3Key;
    }

    await client.query(
      `INSERT INTO photographs (
        filename, category, width, height,
        size_bytes_input, size_bytes_optimized,
        s3_key_original, s3_key_thumb, s3_key_medium,
        cdn_url_original, cdn_url_thumb, cdn_url_medium
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (filename) DO NOTHING`,
      [
        filename,
        category,
        width,
        height,
        sizeInput,
        sizeOptimized,
        s3Original,
        s3Thumb,
        s3Medium,
        getCdnUrl(s3Original),
        getCdnUrl(s3Thumb),
        getCdnUrl(s3Medium),
      ],
    );

    if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${count}`);
  }

  const { rows } = await client.query("SELECT COUNT(*)::int AS c FROM photographs");
  console.log(`Done. Total rows: ${rows[0].c}`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
