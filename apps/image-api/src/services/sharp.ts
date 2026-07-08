import sharp from "sharp";

export interface ProcessedVariant {
  buffer: Buffer;
  bytes: number;
  width: number;
  height: number;
  s3Key: string;
  contentType: string;
}

export interface ProcessedImage {
  inputBytes: number;
  original: ProcessedVariant;
  medium: ProcessedVariant;
  thumb: ProcessedVariant;
  compressionRatio: number;
}

export async function processImage(
  input: Buffer,
  baseKey: string,
): Promise<ProcessedImage> {
  const inputBytes = input.length;
  const metadata = await sharp(input).metadata();
  const origWidth = metadata.width ?? 1;
  const origHeight = metadata.height ?? 1;

  const originalBuffer = await sharp(input)
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const originalMeta = await sharp(originalBuffer).metadata();

  const mediumBuffer = await sharp(input)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const mediumMeta = await sharp(mediumBuffer).metadata();

  const thumbBuffer = await sharp(input)
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const thumbMeta = await sharp(thumbBuffer).metadata();

  const optimizedBytes =
    originalBuffer.length + mediumBuffer.length + thumbBuffer.length;

  return {
    inputBytes,
    original: {
      buffer: originalBuffer,
      bytes: originalBuffer.length,
      width: originalMeta.width ?? origWidth,
      height: originalMeta.height ?? origHeight,
      s3Key: `${baseKey}/original.jpg`,
      contentType: "image/jpeg",
    },
    medium: {
      buffer: mediumBuffer,
      bytes: mediumBuffer.length,
      width: mediumMeta.width ?? origWidth,
      height: mediumMeta.height ?? origHeight,
      s3Key: `${baseKey}/medium.webp`,
      contentType: "image/webp",
    },
    thumb: {
      buffer: thumbBuffer,
      bytes: thumbBuffer.length,
      width: thumbMeta.width ?? origWidth,
      height: thumbMeta.height ?? origHeight,
      s3Key: `${baseKey}/thumb.webp`,
      contentType: "image/webp",
    },
    compressionRatio: 1 - optimizedBytes / inputBytes,
  };
}
