import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "8000", 10),
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://portfolio:portfolio@localhost:5433/portfolio",
  aws: {
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION ?? "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
    bucket: process.env.S3_BUCKET ?? "images",
  },
  cloudfrontUrl: process.env.CLOUDFRONT_URL ?? "http://localhost:4566/images",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  github: {
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
  },
  adminGithubUsername: process.env.ADMIN_GITHUB_USERNAME ?? "Tydos",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3001,http://localhost:3000").split(","),
  disableRateLimit: process.env.DISABLE_RATE_LIMIT === "true",
};
