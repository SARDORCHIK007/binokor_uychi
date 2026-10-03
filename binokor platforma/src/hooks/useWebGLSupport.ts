import { useState } from "react";

export type DeviceTier = "none" | "lite" | "full";

function detect(): DeviceTier {
  if (typeof window === "undefined") return "none";
  const params = new URLSearchParams(window.location.search);
  // Sinov uchun: ?no3d — fallback rasmlar, ?lite — yengil rejim
  if (params.has("no3d")) return "none";
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 2) return "none";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "none";
  } catch {
    return "none";
  }
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (params.has("lite") || (typeof cores === "number" && cores <= 4) || (memory !== undefined && memory <= 4)) {
    return "lite";
  }
  return "full";
}

let cached: DeviceTier | null = null;

/**
 * Qurilma darajasi: "none" — WebGL yo'q yoki juda zaif (fallback rasmlar),
 * "lite" — o'rtacha (bir vaqtda kam 3D sahna), "full" — to'liq.
 */
export function useDeviceTier(): DeviceTier {
  const [tier] = useState(() => {
    if (cached === null) cached = detect();
    return cached;
  });
  return tier;
}

/** WebGL mavjud va qurilma yetarlicha kuchli bo'lsa `true`. */
export function useWebGLSupport(): boolean {
  return useDeviceTier() !== "none";
}
