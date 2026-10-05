/**
 * Saytdagi o'zgaruvchan ma'lumotlar. Shu yerda almashtiring.
 * Bo'sh qoldirilgan maydon saytda ko'rsatilmaydi (namunaviy "XX" chiqmaydi).
 */
interface SiteConfig {
  phone: string;
  email: string;
  telegram: string;
  address: string;
  mapUrl: string;
  CONTACT_ENDPOINT: string;
  PHASE_YEARS: readonly string[];
}

export const CONFIG: SiteConfig = {
  /** Masalan: "+998 69 123 45 67" */
  phone: "",
  /** Masalan: "qurilish@namdtu.uz" */
  email: "",
  /** Masalan: "https://t.me/namdtu_qurilish" */
  telegram: "",
  address: "Namangan viloyati, Uychi tumani",
  /** O'quv maskani (NamDTU Qurilish fakulteti, Uychi tumani) — Google Maps havolasi */
  mapUrl: "https://maps.app.goo.gl/o4LfDyiHXKDjnzjh7",
  /** Murojaat formasi ma'lumoti yuboriladigan manzil. Bo'sh bo'lsa, forma ko'rsatilmaydi. */
  CONTACT_ENDPOINT: "",
  PHASE_YEARS: ["1-bosqich", "2-bosqich", "3-bosqich"],
};

/** Menyu va anchor havolalar tartibi. */
export const NAV_ITEMS = [
  { id: "about", key: "nav.about" },
  { id: "program", key: "nav.program" },
  { id: "trades", key: "nav.trades" },
  { id: "international", key: "nav.international" },
  { id: "roadmap", key: "nav.roadmap" },
  { id: "partners", key: "nav.partners" },
  { id: "contact", key: "nav.contact" },
] as const;
