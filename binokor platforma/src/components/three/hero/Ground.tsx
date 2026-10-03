import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { FOUNDATION, GROUND_SIZE, T, easeOut, seg } from "./timeline";

const OUTLINE_PAD = 0.4;
const W = FOUNDATION.w + OUTLINE_PAD;
const D = FOUNDATION.d + OUTLINE_PAD;
const BAR = 0.16;

/** Poydevor konturi: 4 ta chiziq soat strelkasi bo'yicha birma-bir chiziladi. */
const BARS: { pos: [number, number]; rot: number; len: number }[] = [
  { pos: [-W / 2, D / 2], rot: 0, len: W },
  { pos: [W / 2, D / 2], rot: Math.PI / 2, len: D },
  { pos: [W / 2, -D / 2], rot: Math.PI, len: W },
  { pos: [-W / 2, -D / 2], rot: -Math.PI / 2, len: D },
];

const WALK = { w: 3, len: 14 };

export function Ground({ progress }: { progress: MutableRefObject<number> }) {
  const bars = useRef<(Group | null)[]>([]);
  const walk = useRef<Group>(null);
  const site = useRef<Mesh>(null);

  useFrame(() => {
    const p = progress.current;
    const [a, b] = T.outline;
    const step = (b - a) / BARS.length;
    bars.current.forEach((g, i) => {
      if (!g) return;
      const s = seg(p, a + i * step, a + (i + 1) * step);
      g.visible = s > 0;
      g.scale.x = Math.max(s, 0.0001);
    });
    // Qurilish tugagach tuproq maydoni bino atrofigacha qisqaradi (ko'kalamzorlashtirish)
    if (site.current) {
      const g = easeOut(seg(p, T.final[0], T.final[0] + 0.06));
      site.current.scale.set(1 - 0.45 * g, 1 - 0.55 * g, 1);
    }
    if (walk.current) {
      const s = easeOut(seg(p, T.final[0], T.final[0] + 0.04));
      walk.current.visible = s > 0;
      walk.current.scale.z = Math.max(s, 0.0001);
    }
  });

  return (
    <group>
      {/* Ufqqacha cho'zilgan yer (tuman bilan osmonga qo'shiladi) */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow material={mat("ground")}>
        <circleGeometry args={[GROUND_SIZE * 3, 48]} />
      </mesh>
      {/* Qurilish maydoni (tuproq) */}
      <mesh ref={site} rotation-x={-Math.PI / 2} position-y={-0.005} receiveShadow material={mat("#8C7A5E", { roughness: 1 })}>
        <planeGeometry args={[GROUND_SIZE * 0.68, GROUND_SIZE * 0.68]} />
      </mesh>

      {BARS.map((bar, i) => (
        <group
          key={i}
          ref={(el) => (bars.current[i] = el)}
          position={[bar.pos[0], 0.03, bar.pos[1]]}
          rotation-y={bar.rot}
        >
          <mesh position={[bar.len / 2, 0, 0]} material={mat("amber")}>
            <RBoxGeo args={[bar.len + BAR, 0.04, BAR]} />
          </mesh>
        </group>
      ))}

      {/* Yo'lak: binoning chap tomonidan maydon chetiga */}
      <group ref={walk} position={[-FOUNDATION.w / 2, 0.02, 0]} rotation-y={Math.PI / 2} visible={false}>
        <mesh position={[0, 0, -WALK.len / 2]} receiveShadow material={mat("path")}>
          <RBoxGeo args={[WALK.w, 0.04, WALK.len]} />
        </mesh>
      </group>
    </group>
  );
}
