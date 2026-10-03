import { Color, MeshStandardMaterial } from "three";

/** 3D sahnalardagi umumiy ranglar (dizayn tizimi 4.1 bilan mos). */
export const COLORS = {
  navy: "#0B1F3A",
  navy700: "#13305A",
  amber: "#F5A623",
  concrete: "#8A939E",
  paper: "#F2F4F7",
  brick: "#B5562F",
  steel: "#5F6B78",
  wood: "#A9743F",
  ground: "#6F7A47",
  grass: "#4E7A3A",
  grassDark: "#3F6630",
  wall: "#E6E0D3",
  slab: "#9AA3AD",
  path: "#C9C4B8",
  glass: "#1D3557",
  warmLight: "#FFC861",
  signal: "#FF3B30",
  skin: "#E0B48A",
  suit: "#1F3B66",
  base: "#B8C2CF",
  mortar: "#A9AEB4",
  wetConcrete: "#7E868F",
  plaster: "#EEF0F2",
  copper: "#E8B640",
  rubber: "#22262B",
  white: "#FFFFFF",
} as const;

export type ColorName = keyof typeof COLORS;

interface MatOptions {
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
  /** Qirrali (low-poly) soyalash — kerak bo'lgan joylarda */
  flat?: boolean;
}

/** Material turiga qarab realistik sirt xossalari (PBR). */
const PRESETS: Partial<Record<ColorName, { roughness: number; metalness: number }>> = {
  steel: { roughness: 0.38, metalness: 0.65 },
  glass: { roughness: 0.06, metalness: 0.25 },
  amber: { roughness: 0.42, metalness: 0.1 }, // bo'yalgan metall / plastik kaska
  signal: { roughness: 0.3, metalness: 0 },
  concrete: { roughness: 0.95, metalness: 0 },
  mortar: { roughness: 1, metalness: 0 },
  wetConcrete: { roughness: 0.32, metalness: 0 },
  wood: { roughness: 0.72, metalness: 0 },
  brick: { roughness: 0.92, metalness: 0 },
  skin: { roughness: 0.6, metalness: 0 },
  suit: { roughness: 0.88, metalness: 0 },
  ground: { roughness: 1, metalness: 0 },
  grass: { roughness: 0.85, metalness: 0 },
  grassDark: { roughness: 0.85, metalness: 0 },
  wall: { roughness: 0.9, metalness: 0 },
  plaster: { roughness: 0.9, metalness: 0 },
  slab: { roughness: 0.85, metalness: 0 },
  rubber: { roughness: 0.75, metalness: 0 },
  copper: { roughness: 0.35, metalness: 0.7 },
};

const cache = new Map<string, MeshStandardMaterial>();

/**
 * Umumiy PBR material: silliq soyalash, material turiga mos g'adir-budurlik va
 * metallik. Bir xil parametrlar uchun bitta nusxa qaytaradi — GPU'da material soni kam.
 */
export function mat(color: ColorName | string, opts: MatOptions = {}): MeshStandardMaterial {
  const named = color in COLORS ? (color as ColorName) : null;
  const hex = named ? COLORS[named] : color;
  const preset = (named && PRESETS[named]) || { roughness: 0.7, metalness: 0.02 };
  const key = `${hex}|${JSON.stringify(opts)}`;
  let m = cache.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color: new Color(hex),
      flatShading: opts.flat ?? false,
      roughness: opts.roughness ?? preset.roughness,
      metalness: opts.metalness ?? preset.metalness,
      emissive: new Color(opts.emissive ?? "#000000"),
      emissiveIntensity: opts.emissiveIntensity ?? 1,
      transparent: opts.transparent ?? false,
      opacity: opts.opacity ?? 1,
    });
    cache.set(key, m);
  }
  return m;
}
