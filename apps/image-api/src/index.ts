import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./routes/auth";
import imageRoutes from "./routes/images";
import { pingDb } from "./services/db";
import { pingRedis } from "./services/cache";
import { ensureBucket } from "./services/s3";

const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  const [db, redis] = await Promise.all([pingDb(), pingRedis()]);
  let s3 = false;
  try {
    await ensureBucket();
    s3 = true;
  } catch {
    s3 = false;
  }

  const ok = db && s3;
  res.status(ok ? 200 : 503).json({
    message: "server active",
    database: db ? "connected" : "failed",
    redis: redis ? "connected" : "unavailable",
    s3: s3 ? "connected" : "failed",
  });
});

app.get("/api", (_req, res) => {
  res.json({ message: "Image Hosting API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ detail: err.message ?? "Internal server error" });
  },
);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Image API listening on http://localhost:${config.port}`);
  });
}

export default app;
