import sharp from "sharp";
import { processImage } from "../../src/services/sharp";

async function makeTestJpeg(width = 800, height = 600): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 100, g: 150, b: 200 },
    },
  })
    .jpeg({ quality: 95 })
    .toBuffer();
}

describe("processImage", () => {
  it("produces three variants smaller than high-quality input", async () => {
    const input = await makeTestJpeg(3000, 2000);
    const result = await processImage(input, "test-photo");

    expect(result.thumb.s3Key).toBe("test-photo/thumb.webp");
    expect(result.medium.s3Key).toBe("test-photo/medium.webp");
    expect(result.original.s3Key).toBe("test-photo/original.jpg");

    expect(result.thumb.width).toBeLessThanOrEqual(400);
    expect(result.medium.width).toBeLessThanOrEqual(1200);
    expect(result.original.width).toBeLessThanOrEqual(2400);

    const optimized =
      result.original.bytes + result.medium.bytes + result.thumb.bytes;
    expect(optimized).toBeLessThan(input.length);
  });

  it("reports compression ratio", async () => {
    const input = await makeTestJpeg(2000, 1500);
    const result = await processImage(input, "ratio-test");
    expect(result.compressionRatio).toBeGreaterThan(0);
    expect(result.compressionRatio).toBeLessThan(1);
  });
});
