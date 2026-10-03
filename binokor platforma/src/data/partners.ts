/**
 * Hamkor logotiplari (`public/partners/`). Tartib `partners.list` bilan bir xil:
 * 0 — NamDTU (asosiy tashabbuskor), 1 — viloyat hokimligi, 2 — tuman hokimligi, 3 — IT Park.
 * Hokimliklar uchun — Davlat gerbi. `w`, `h` — rasmning haqiqiy o'lchami (piksel).
 */
export const PARTNER_LOGOS: { src: string; w: number; h: number }[] = [
  { src: "/partners/namdtu.webp", w: 360, h: 360 },
  { src: "/partners/gerb.webp", w: 355, h: 360 },
  { src: "/partners/gerb.webp", w: 355, h: 360 },
  { src: "/partners/itpark.webp", w: 727, h: 240 },
];

/** Asosiy tashabbuskor indeksi */
export const INITIATOR_INDEX = 0;
