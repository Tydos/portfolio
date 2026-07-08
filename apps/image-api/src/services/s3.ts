import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "../config";

const s3 = new S3Client({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  forcePathStyle: Boolean(config.aws.endpoint),
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export function getCdnUrl(key: string): string {
  const base = config.cloudfrontUrl.replace(/\/$/, "");
  return `${base}/${key}`;
}

export async function ensureBucket(): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.aws.bucket }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: config.aws.bucket }));
  }
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function deleteObjects(keys: string[]): Promise<void> {
  await Promise.all(
    keys.map((key) =>
      s3.send(
        new DeleteObjectCommand({ Bucket: config.aws.bucket, Key: key }),
      ),
    ),
  );
}

export { s3 };
