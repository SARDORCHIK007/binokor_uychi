/**
 * Saytdagi o'zgaruvchan ma'lumotlar. Shu yerda almashtiring.
 */
export const CONFIG = {
  phone: "+998 XX XXX XX XX",
  email: "info@example.uz",
  telegram: "https://t.me/",
  address: "Namangan viloyati, Uychi tumani",
  /** O'quv maskani (NamDTU Qurilish fakulteti, Uychi tumani) — Google Maps havolasi */
  mapUrl: "https://maps.app.goo.gl/o4LfDyiHXKDjnzjh7",
  /** Bo'sh bo'lsa, forma ma'lumotni hech qayerga yubormaydi. */
  CONTACT_ENDPOINT: "",
  PHASE_YEARS: ["1-bosqich", "2-bosqich", "3-bosqich"],
} as const;

/** Menyu va anchor havolalar tartibi. */
export const NAV_ITEMS = [
  { id: "problem", key: "nav.project" },
  { id: "model", key: "nav.model" },
  { id: "campus", key: "nav.campus" },
  { id: "trades", key: "nav.trades" },
  { id: "international", key: "nav.international" },
  { id: "results", key: "nav.results" },
  { id: "partners", key: "nav.partners" },
  { id: "contact", key: "nav.contact" },
] as const;
