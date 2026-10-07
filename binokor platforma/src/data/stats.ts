/**
 * Uychi tumani mahallalari kesimida qurilish ustalari to'g'risida ma'lumot (2026, 53 MFY).
 * Manba fayli: "Жами Uychi_ustalar_MFY_kesimida.xlsx" — "ТУМАН БЎЙИЧА ЖАМИ" qatori.
 * Rasmiy — mehnat shartnomasi yoki o'zini o'zi band qilgan shaxs sifatida ro'yxatdan o'tgan usta.
 * Kasb nomlari: `statistics.trades.<key>` (uz.json / en.json).
 */
export interface TradeStat {
  key: string;
  formal: number;
  informal: number;
}

export const MASTERS = {
  mahallas: 53,
  total: 3835,
  formal: 364,
  informal: 3471,
  /** Migratsiyada: jami, shundan rasmiy */
  migration: 1388,
  migrationFormal: 19,
};

/** Kamayish tartibida; "other" (boshqa kasblar) har doim oxirida. */
export const TRADE_STATS: TradeStat[] = [
  { key: "bricklayer", formal: 109, informal: 560 },
  { key: "concrete", formal: 42, informal: 456 },
  { key: "painter", formal: 60, informal: 436 },
  { key: "plasterer", formal: 35, informal: 421 },
  { key: "facade", formal: 5, informal: 308 },
  { key: "roofer", formal: 8, informal: 143 },
  { key: "carpenter", formal: 12, informal: 107 },
  { key: "finisher", formal: 17, informal: 101 },
  { key: "drywall", formal: 6, informal: 88 },
  { key: "rebar", formal: 2, informal: 91 },
  { key: "plumber", formal: 17, informal: 63 },
  { key: "electrician", formal: 23, informal: 52 },
  { key: "tiler", formal: 9, informal: 61 },
  { key: "welder", formal: 6, informal: 60 },
  { key: "operator", formal: 7, informal: 50 },
  { key: "blacksmith", formal: 0, informal: 50 },
  { key: "locksmith", formal: 2, informal: 17 },
  { key: "ganch", formal: 0, informal: 19 },
  { key: "woodcarver", formal: 1, informal: 6 },
  { key: "potter", formal: 0, informal: 1 },
  { key: "other", formal: 3, informal: 381 },
];
