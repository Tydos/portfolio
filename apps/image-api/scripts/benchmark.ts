/**
 * Benchmark GET /api/images latency. Saves report to docs/benchmarks/.
 */
import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL ?? "http://localhost:8000";
const REQUESTS = parseInt(process.env.BENCHMARK_REQUESTS ?? "200", 10);

async function measure(label: string, url: string) {
  const times: number[] = [];

  for (let i = 0; i < REQUESTS; i++) {
    const start = performance.now();
    const res = await fetch(url);
    await res.json();
    times.push(performance.now() - start);
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error(
          `${label} failed: 429 Too Many Requests. Restart the API with DISABLE_RATE_LIMIT=true`,
        );
      }
      throw new Error(`${label} failed: ${res.status}`);
    }
  }

  times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];

  return { label, requests: REQUESTS, avg_ms: avg, p50_ms: p50, p95_ms: p95 };
}

async function main() {
  const url = `${API_URL}/api/images?limit=50&offset=0`;
  console.log(`Benchmarking ${url} (${REQUESTS} requests)...`);

  const result = await measure("gallery-list", url);
  console.log(result);

  const outDir = path.join(__dirname, "../../../docs/benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "latency-report.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ generated_at: new Date().toISOString(), ...result }, null, 2),
  );
  console.log(`Saved ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
