import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeInOut, easeOutBounce, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const N = 5;
const TILE = 0.42;
const GAP = 0.04;
const STEP = TILE + GAP;
const TILE_H = 0.04;
const BASE_Y = 0.02; // tekislangan asos (styajka)
const SIZE = N * STEP + GAP;

const START = 0.3;
const DIAG = 0.28; // diagonal qatorlar orasidagi kechikish
const FALL = 0.32;
const GROUT = [2.95, 3.45] as const;
const SHINE = [3.6, 4.5] as const;

/** Diagonal tartib: (i + j) bo'yicha, bir diagonal ichida kichik siljish. */
const tileStart = (i: number, j: number) => START + (i + j) * DIAG + i * 0.04;
const pos = (k: number) => -SIZE / 2 + GAP + TILE / 2 + k * STEP;

function pose(t: number): WorkerPose {
  const lay = seg(t, 0.1, 0.35) * (1 - seg(t, GROUT[0], GROUT[0] + 0.4));
  const bob = Math.sin(t * Math.PI * 2 / DIAG) * 0.15 * lay;
  return {
    torso: [0.75 * lay, 0, 0],
    head: [0.2 * lay, 0, 0],
    rightArm: [-0.7 * lay + bob, 0, -0.1 * lay],
    leftArm: [-0.5 * lay, 0, 0.1 * lay],
  };
}

export default function Tiler({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const tiles = useRef<(Mesh | null)[]>([]);
  const grout = useRef<Mesh>(null);
  const shine = useRef<Mesh>(null);

  useFrame(() => {
    const t = time.current;

    // Plitkalar diagonal tartibda yuqoridan tushadi
    tiles.current.forEach((m, k) => {
      if (!m) return;
      const i = Math.floor(k / N);
      const j = k % N;
      const s0 = tileStart(i, j);
      const s = seg(t, s0, s0 + FALL);
      m.visible = t >= s0;
      m.position.y = BASE_Y + TILE_H / 2 + 0.6 * (1 - easeOutBounce(s));
    });

    // Oq choklar pastdan to'ladi
    if (grout.current) {
      const g = easeInOut(seg(t, GROUT[0], GROUT[1]));
      grout.current.visible = g > 0;
      const h = Math.max(TILE_H * 0.9 * g, 0.001);
      grout.current.scale.y = h;
      grout.current.position.y = BASE_Y + h / 2;
    }

    // Yorug'lik izi sirt bo'ylab diagonal o'tadi
    if (shine.current) {
      const s = seg(t, SHINE[0], SHINE[1]);
      shine.current.visible = s > 0 && s < 1;
      const d = -SIZE * 0.75 + s * SIZE * 1.5;
      shine.current.position.set(d * 0.7071, BASE_Y + TILE_H + 0.004, d * 0.7071);
      (shine.current.material as { opacity: number }).opacity = Math.sin(s * Math.PI) * 0.65;
    }
  });

  const colors = [mat("#F3EEE4", { roughness: 0.3, metalness: 0.05 }), mat("#4F86B5", { roughness: 0.3, metalness: 0.05 })];

  return (
    <group position-x={-0.3}>
      {/* Asos (styajka) */}
      <mesh position-y={BASE_Y / 2} receiveShadow={shadows} material={mat("steel")}>
        <RBoxGeo args={[SIZE, BASE_Y, SIZE]} />
      </mesh>
      {/* Choklar uchun oq to'ldiruvchi */}
      <mesh ref={grout} visible={false} material={mat("white")}>
        <RBoxGeo args={[SIZE - 0.01, 1, SIZE - 0.01]} />
      </mesh>

      {Array.from({ length: N * N }, (_, k) => {
        const i = Math.floor(k / N);
        const j = k % N;
        return (
          <mesh
            key={k}
            ref={(el) => (tiles.current[k] = el)}
            position={[pos(j), BASE_Y, pos(i)]}
            visible={false}
            castShadow={shadows}
            receiveShadow={shadows}
            material={colors[(i + j) % 2]}
          >
            <RBoxGeo args={[TILE, TILE_H, TILE]} />
          </mesh>
        );
      })}

      {/* Yaltirash izi */}
      <mesh ref={shine} rotation={[-Math.PI / 2, 0, Math.PI / 4]} visible={false}>
        <planeGeometry args={[0.45, SIZE * 1.3]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Plitkalar taxi */}
      <group position={[1.55, 0, -0.75]}>
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} position-y={0.025 + k * 0.045} rotation-y={k * 0.08} castShadow={shadows} material={colors[k % 2]}>
            <RBoxGeo args={[TILE, TILE_H, TILE]} />
          </mesh>
        ))}
      </group>

      <Worker position={[1.6, 0, -0.1]} rotationY={-Math.PI / 2 - 0.35} pose={pose} shadows={shadows} />
    </group>
  );
}
