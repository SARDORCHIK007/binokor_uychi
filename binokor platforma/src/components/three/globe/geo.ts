import { Vector3 } from "three";
import { LAND_MASK, LAND_MASK_N } from "./landMask";

export const GLOBE_R = 2;

/**
 * Kenglik/uzunlik (gradus) → shar sirtidagi nuqta.
 * lon = 0 kameraga (+z) qaragan, sharq +x tomonda.
 */
export function latLonToVec(lat: number, lon: number, r = GLOBE_R): Vector3 {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

/** Quruqlikdagi nuqtalar (birlik vektorlar) — Fibonacci shari + bit-maska. */
export function landPoints(): Vector3[] {
  const bin = atob(LAND_MASK);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: Vector3[] = [];
  for (let i = 0; i < LAND_MASK_N; i++) {
    if (!((bin.charCodeAt(i >> 3) >> (i & 7)) & 1)) continue;
    const y = 1 - ((i + 0.5) * 2) / LAND_MASK_N;
    const r = Math.sqrt(1 - y * y);
    const phi = i * golden;
    out.push(new Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r));
  }
  return out;
}

export const UYCHI = { lat: 41.08, lon: 71.92 };

/** Yo'nalishlar: tartib `international.countries` bilan bir xil. */
export const DESTINATIONS = [
  { lat: 52.52, lon: 13.4 }, // Germaniya (Berlin)
  { lat: 35.68, lon: 139.69 }, // Yaponiya (Tokio)
  { lat: 37.57, lon: 126.98 }, // Janubiy Koreya (Seul)
  { lat: 1.35, lon: 103.82 }, // Singapur
  { lat: 25.2, lon: 55.27 }, // BAA (Dubay)
];
