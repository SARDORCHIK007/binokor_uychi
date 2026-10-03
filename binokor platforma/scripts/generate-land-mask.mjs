/**
 * Globus uchun quruqlik maskasini yaratadi (bir martalik, dev vaqtida).
 * Manba: Natural Earth (public domain) — `world-atlas` paketi, land-110m.
 * Natija: src/components/three/globe/landMask.ts — Fibonacci sharidagi
 * N ta nuqtadan qaysilari quruqlikda ekanini bildiruvchi bit-maska (base64).
 *
 * Ishga tushirish: node scripts/generate-land-mask.mjs
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = require("world-atlas/land-110m.json");
const land = feature(topo, topo.objects.land);

const N = 8000;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const bytes = new Uint8Array(Math.ceil(N / 8));
let count = 0;

for (let i = 0; i < N; i++) {
  // Runtime bilan bir xil formula (globe/landMask.ts → fibonacciPoint)
  const y = 1 - ((i + 0.5) * 2) / N;
  const r = Math.sqrt(1 - y * y);
  const phi = i * GOLDEN;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = (Math.atan2(x, z) * 180) / Math.PI;
  if (geoContains(land, [lon, lat])) {
    bytes[i >> 3] |= 1 << (i & 7);
    count++;
  }
}

const b64 = Buffer.from(bytes).toString("base64");
const out = `// AVTOMATIK YARATILGAN — qo'lda o'zgartirmang. Qayta yaratish: node scripts/generate-land-mask.mjs
// Manba: Natural Earth (public domain), world-atlas land-110m. Quruqlik nuqtalari: ${count}
export const LAND_MASK_N = ${N};
export const LAND_MASK = "${b64}";
`;
fs.writeFileSync("src/components/three/globe/landMask.ts", out);
console.log(`Quruqlik nuqtalari: ${count} / ${N}`);
