/**
 * Hamkor logotiplari (`public/partners/`). Tartib `partners.list` bilan bir xil:
 * 0 — NamDTU (tashabbuskor), 1 — viloyat hokimligi, 2 — tuman hokimligi, 3 — IT Park.
 * `src: null` — logotip o'rniga tashkilot nomining bosh harflari ko'rsatiladi
 * (rasmiy logotip fayli olinguncha). `w`, `h` — rasmning haqiqiy o'lchami (piksel).
 */
export const PARTNER_LOGOS: ({ src: string; w: number; h: number } | null)[] = [
  { src: "/partners/namdtu.webp", w: 360, h: 360 },
  { src: "/partners/gerb.webp", w: 355, h: 360 },
  { src: "/partners/gerb.webp", w: 355, h: 360 },
  { src: "/partners/itpark.webp", w: 727, h: 240 },
];

/** Logotip bo'lmaganda ko'rsatiladigan qisqartma */
export const PARTNER_INITIALS = ["NamDTU", "", "", "IT"];

/** Asosiy tashabbuskor indeksi */
export const INITIATOR_INDEX = 0;

/**
 * Fakultet binosi fotosurati. Rasmiy (haqiqiy) foto olinguncha `null` —
 * saytda rasm o'rniga ko'k panel ko'rsatiladi. Foto tayyor bo'lsa:
 * { src1600: "/campus/namdtu-qurilish-1600.webp", src800: "/campus/namdtu-qurilish-800.webp" }
 */
export const CAMPUS_PHOTO: { src1600: string; src800: string } | null = {
  src1600: "/campus/namdtu-qurilish-1600.webp",
  src800: "/campus/namdtu-qurilish-800.webp",
};
