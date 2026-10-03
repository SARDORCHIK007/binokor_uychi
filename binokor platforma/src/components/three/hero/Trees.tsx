import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { mat } from "../Materials";
import { T, easeOutBack, seg } from "./timeline";

/** 8 ta daraxt: binodan, yo'lakdan va kran o'rnidan uzoqda. */
const TREES: { x: number; z: number; s: number }[] = [
  { x: -14, z: 12, s: 1.1 },
  { x: -6, z: 14, s: 0.9 },
  { x: 9, z: 12, s: 1.2 },
  { x: 15, z: 4, s: 1 },
  { x: 14, z: -8, s: 1.15 },
  { x: 8, z: -14, s: 0.95 },
  { x: -6, z: -15, s: 1.05 },
  { x: -15, z: -7, s: 0.9 },
];

/** Toj shakli: [x, y, z, radius, to'qroq] */
const CROWN: [number, number, number, number, boolean][] = [
  [0, 2.6, 0, 1.15, false],
  [0.55, 2.25, 0.35, 0.8, true],
  [-0.6, 2.3, -0.2, 0.85, true],
  [0.15, 3.25, -0.25, 0.75, false],
  [-0.25, 2.2, 0.6, 0.7, false],
];

export function Trees({
  progress,
  shadows,
  segments,
}: {
  progress: MutableRefObject<number>;
  shadows: boolean;
  segments: number;
}) {
  const refs = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const p = progress.current;
    const [a, b] = T.final;
    const step = (b - a - 0.03) / TREES.length;
    refs.current.forEach((g, i) => {
      if (!g) return;
      const s = Math.max(easeOutBack(seg(p, a + i * step, a + i * step + 0.03)), 0);
      g.visible = s > 0.001;
      g.scale.setScalar(s * TREES[i].s);
    });
  });

  return (
    <group>
      {TREES.map((t, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[t.x, 0, t.z]} visible={false}>
          <mesh position-y={0.9} castShadow={shadows} material={mat("wood", { roughness: 0.9 })}>
            <cylinderGeometry args={[0.16, 0.26, 1.8, 12]} />
          </mesh>
          {/* Barg to'plamlari: bir nechta silliq shar, har xil yashil */}
          {CROWN.map(([x, y, z, r, dark], k) => (
            <mesh
              key={k}
              position={[x, y, z]}
              scale={[1, 0.88, 1]}
              castShadow={shadows}
              material={mat(dark ? "grassDark" : "grass")}
            >
              <icosahedronGeometry args={[r, segments > 5 ? 3 : 2]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
