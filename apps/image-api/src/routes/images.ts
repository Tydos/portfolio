import { Router, Request, Response } from "express";
import multer from "multer";
import { publicReadLimiter, uploadLimiter } from "../middleware/rateLimit";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { processImage } from "../services/sharp";
import { deleteObjects, ensureBucket, getCdnUrl, uploadObject } from "../services/s3";
import {
  deletePhoto,
  fetchPhotos,
  getPhotoById,
  insertPhoto,
} from "../services/db";
import { cacheGet, cacheInvalidate, cacheSet } from "../services/cache";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/\.(jpe?g)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error("Only JPEG files are accepted"));
  },
});

router.get("/", publicReadLimiter, async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10), 100);
  const offset = parseInt(String(req.query.offset ?? "0"), 10);
  const category = req.query.category ? String(req.query.category) : null;

  try {
    const cacheKey = `gallery:${category ?? "all"}:${limit}:${offset}`;
    const cached = await cacheGet<{ data: unknown[]; total: number }>(cacheKey);
    if (cached) {
      res.json({ ...cached, limit, offset, cached: true });
      return;
    }

    const result = await fetchPhotos(limit, offset, category);
    await cacheSet(cacheKey, result);
    res.json({ ...result, limit, offset, cached: false });
  } catch {
    res.status(503).json({ detail: "Database unavailable" });
  }
});

router.get("/:id", publicReadLimiter, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const photo = await getPhotoById(id);
  if (!photo) {
    res.status(404).json({ detail: "Photo not found" });
    return;
  }
  res.json(photo);
});

router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  uploadLimiter,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ detail: "No file uploaded" });
      return;
    }

    const category = (req.body.category as string) || "nature";
    const filename = `${Date.now()}_${req.file.originalname.toLowerCase()}`;
    const baseKey = filename.replace(/\.[^.]+$/, "");

    await ensureBucket();
    const processed = await processImage(req.file.buffer, baseKey);

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

    const optimizedBytes =
      processed.original.bytes + processed.medium.bytes + processed.thumb.bytes;

    const photo = await insertPhoto({
      filename,
      category,
      width: processed.original.width,
      height: processed.original.height,
      sizeBytesInput: processed.inputBytes,
      sizeBytesOptimized: optimizedBytes,
      s3KeyOriginal: processed.original.s3Key,
      s3KeyThumb: processed.thumb.s3Key,
      s3KeyMedium: processed.medium.s3Key,
      cdnUrlOriginal: getCdnUrl(processed.original.s3Key),
      cdnUrlThumb: getCdnUrl(processed.thumb.s3Key),
      cdnUrlMedium: getCdnUrl(processed.medium.s3Key),
      uploadedBy: req.user?.sub,
    });

    await cacheInvalidate("gallery:*");

    res.status(201).json({
      ...photo,
      compression_ratio: processed.compressionRatio,
    });
  },
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    try {
      const keys = await deletePhoto(id);
      await deleteObjects(keys);
      await cacheInvalidate("gallery:*");
      res.status(204).send();
    } catch {
      res.status(404).json({ detail: "Photo not found" });
    }
  },
);

export default router;
