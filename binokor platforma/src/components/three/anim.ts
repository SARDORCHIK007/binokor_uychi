/** 3D animatsiyalar uchun umumiy yordamchi funksiyalar (sof). */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** `p` ning [a, b] oralig'idagi nisbiy o'rni (0..1). */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** Yuqoridan tushib, yerga urilib biroz sakraydigan harakat (0 → 1). */
export const easeOutBounce = (t: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
/** 0 → 1 → 0 yumshoq "puls" (t ∈ [0, 1]). */
export const pulse = (t: number) => Math.sin(clamp01(t) * Math.PI);
