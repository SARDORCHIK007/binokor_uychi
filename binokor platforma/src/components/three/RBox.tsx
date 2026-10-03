import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const cache = new Map<string, RoundedBoxGeometry>();

/**
 * Qirralari yumaloqlangan quti geometriyasi. `<boxGeometry args={[w, h, d]} />`
 * o'rniga ishlatiladi. Bir xil o'lchamlar uchun bitta geometriya qayta ishlatiladi.
 */
export function roundedBox(w: number, h: number, d: number, radius?: number): RoundedBoxGeometry {
  const r = radius ?? Math.min(Math.min(w, h, d) * 0.18, 0.06);
  const key = `${w}|${h}|${d}|${r}`;
  let g = cache.get(key);
  if (!g) {
    g = new RoundedBoxGeometry(w, h, d, 2, r);
    cache.set(key, g);
  }
  return g;
}

/** JSX uchun: `<mesh><RBoxGeo args={[w, h, d]} /></mesh>` */
export function RBoxGeo({ args, radius }: { args: [number, number, number]; radius?: number }) {
  return <primitive object={roundedBox(args[0], args[1], args[2], radius)} attach="geometry" />;
}
