/**
 * Hero sahnasining scroll-timeline'i (TZ 6.1). Barcha funksiyalar sof:
 * `p` — scroll progress (0 → 1), natija — obyektlarning holati.
 */

import { easeIn, easeInOut, easeOut, easeOutBack, lerp, seg } from "../anim";

export { clamp01, easeIn, easeInOut, easeOut, easeOutBack, lerp, seg } from "../anim";

// --- O'lchamlar -----------------------------------------------------------
export const GROUND_SIZE = 40;
export const FOUNDATION = { w: 12, h: 0.6, d: 8 } as const;
export const FLOOR = { w: 12, h: 3, d: 8 } as const;
export const FLOORS = 5;

export const TOWER_H = 22;
export const JIB_LEN = 16;
/** Kran poydevori (x, z). */
export const CRANE_POS = { x: 0, z: -11 } as const;
/** Krandan bino markazigacha masofa — arava (trolley) shu radiusda turadi. */
export const RADIUS = Math.hypot(CRANE_POS.x, CRANE_POS.z);
/** Strela burchagi: bino tomonga va yuk olinadigan joyga. */
export const PHI_BUILDING = Math.atan2(-CRANE_POS.z, -CRANE_POS.x);
export const PHI_PICKUP = 0; // yuk bino orqa-o'ng tomonida, yerda

const HOOK_OFFSET = 1.7; // ilgak bilan blok markazi orasidagi masofa
const HOOK_IDLE = 18;

// --- Bosqichlar (TZ jadvali) ----------------------------------------------
export const T = {
  outline: [0, 0.1],
  foundation: [0.1, 0.2],
  craneIn: [0.1, 0.2], // intro davomida to'liq ko'tariladi
  floorsStart: 0.2,
  floorSpan: 0.11,
  windows: [0.75, 0.85],
  lights: [0.85, 0.92],
  final: [0.92, 1],
} as const;

export const floorBase = (k: number) => FOUNDATION.h + k * FLOOR.h;
export const floorCenter = (k: number) => floorBase(k) + FLOOR.h / 2;
const restHook = (k: number) => floorCenter(k) + HOOK_OFFSET + 1.5;

/** Strela burchagi bo'yicha ilgak ostidagi nuqta (x, z). */
export function trolleyXZ(phi: number): [number, number] {
  return [CRANE_POS.x + RADIUS * Math.cos(phi), CRANE_POS.z + RADIUS * Math.sin(phi)];
}

export const PICKUP_XZ = trolleyXZ(PHI_PICKUP);

export interface FloorState {
  visible: boolean;
  x: number;
  y: number;
  z: number;
  /** Paydo bo'lish (0..1) */
  grow: number;
  /** Tushgandagi siqilish (bounce) */
  squash: number;
}

export interface CraneState {
  visible: boolean;
  /** Kranning vertikal siljishi (paydo bo'lish / ketish) */
  riseY: number;
  phi: number;
  hookY: number;
}

export interface SceneState {
  crane: CraneState;
  floors: FloorState[];
}

const hidden = (): FloorState => ({ visible: false, x: 0, y: 0, z: 0, grow: 0, squash: 0 });
const placed = (k: number): FloorState => ({
  visible: true,
  x: 0,
  y: floorCenter(k),
  z: 0,
  grow: 1,
  squash: 0,
});

/** Butun sahnaning (kran + qavatlar) `p` dagi holati. */
export function sceneAt(p: number): SceneState {
  const rise = easeOut(seg(p, T.craneIn[0], T.craneIn[1]));
  const leave = easeIn(seg(p, T.final[0], 0.99));
  const crane: CraneState = {
    visible: p > T.craneIn[0] && p < 0.995,
    riseY: lerp(-TOWER_H - 8, 0, rise) - (TOWER_H + 8) * leave, // cho'qqi bilan to'liq yer ostiga
    phi: PHI_BUILDING,
    hookY: HOOK_IDLE,
  };
  const floors: FloorState[] = [];

  for (let k = 0; k < FLOORS; k++) {
    const start = T.floorsStart + k * T.floorSpan;
    const end = start + T.floorSpan;
    if (p >= end) {
      floors.push(placed(k));
      crane.hookY = restHook(k);
      continue;
    }
    if (p < start) {
      floors.push(hidden());
      continue;
    }

    // Faol qavat: kran uni ko'tarib, joyiga qo'yadi.
    const t = seg(p, start, end);
    const prevHook = k === 0 ? HOOK_IDLE : restHook(k - 1);
    const carryHook = floorCenter(k) + 4 + HOOK_OFFSET;
    const targetHook = floorCenter(k) + HOOK_OFFSET;
    const groundHook = FLOOR.h / 2 + HOOK_OFFSET;
    const [px, pz] = PICKUP_XZ;
    let st: FloorState;

    if (t < 0.2) {
      // A: strela yuk tomonga buriladi, blok yerda paydo bo'ladi
      const a = easeInOut(seg(t, 0, 0.2));
      crane.phi = lerp(PHI_BUILDING, PHI_PICKUP, a);
      crane.hookY = prevHook;
      st = { visible: true, x: px, y: FLOOR.h / 2, z: pz, grow: easeOut(seg(t, 0, 0.15)), squash: 0 };
    } else if (t < 0.35) {
      // B: ilgak blokka tushadi
      crane.phi = PHI_PICKUP;
      crane.hookY = lerp(prevHook, groundHook, easeInOut(seg(t, 0.2, 0.35)));
      st = { visible: true, x: px, y: FLOOR.h / 2, z: pz, grow: 1, squash: 0 };
    } else if (t < 0.5) {
      // C: blok ko'tariladi
      crane.phi = PHI_PICKUP;
      crane.hookY = lerp(groundHook, carryHook, easeInOut(seg(t, 0.35, 0.5)));
      st = { visible: true, x: px, y: crane.hookY - HOOK_OFFSET, z: pz, grow: 1, squash: 0 };
    } else if (t < 0.75) {
      // D: strela binoga buriladi
      crane.phi = lerp(PHI_PICKUP, PHI_BUILDING, easeInOut(seg(t, 0.5, 0.75)));
      crane.hookY = carryHook;
      const [x, z] = trolleyXZ(crane.phi);
      st = { visible: true, x, y: carryHook - HOOK_OFFSET, z, grow: 1, squash: 0 };
    } else if (t < 0.92) {
      // E: joyiga tushiriladi
      crane.hookY = lerp(carryHook, targetHook, easeInOut(seg(t, 0.75, 0.92)));
      st = { visible: true, x: 0, y: crane.hookY - HOOK_OFFSET, z: 0, grow: 1, squash: 0 };
    } else {
      // F: blok "o'tiradi" — kichik bounce, ilgak bo'shaydi
      const s = seg(t, 0.92, 1);
      const bounce = Math.abs(Math.sin(s * Math.PI * 2)) * 0.35 * Math.pow(1 - s, 2);
      crane.hookY = lerp(targetHook, restHook(k), easeOut(s));
      st = {
        visible: true,
        x: 0,
        y: floorCenter(k) + bounce,
        z: 0,
        grow: 1,
        squash: Math.sin(s * Math.PI) * (1 - s) * 0.08,
      };
    }
    floors.push(st);
  }

  return { crane, floors };
}

// --- Derazalar va chiroqlar -------------------------------------------------
export const WINDOWS_PER_SIDE = 6;
export const WINDOW_COUNT = FLOORS * WINDOWS_PER_SIDE * 2; // 60

/** Deraza i ning paydo bo'lish darajasi (birma-bir). */
export function windowGrow(p: number, i: number): number {
  const [a, b] = T.windows;
  const step = (b - a - 0.012) / WINDOW_COUNT;
  return easeOutBack(seg(p, a + i * step, a + i * step + 0.012));
}

/** 60% derazani deterministik tanlash (har safar bir xil). */
export const LIT_WINDOWS: number[] = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const ids = Array.from({ length: WINDOW_COUNT }, (_, i) => i);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, Math.round(WINDOW_COUNT * 0.6));
})();

export function lightOn(p: number, rank: number): number {
  const [a, b] = T.lights;
  const step = (b - a - 0.008) / LIT_WINDOWS.length;
  return easeOut(seg(p, a + rank * step, a + rank * step + 0.008));
}
