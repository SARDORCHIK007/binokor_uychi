import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeOutBounce, pulse, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const ROWS = 4;
const PER_ROW = 6;
const BRICK = { l: 0.4, h: 0.18, d: 0.2, gapX: 0.02, gapY: 0.04 };
const STEP_X = BRICK.l + BRICK.gapX;
const STEP_Y = BRICK.h + BRICK.gapY;
const FOOTING_TOP = 0.1;
const WALL_X = -0.25;
const WALL_Z = -0.3;

const START = 0.4;
const EACH = 0.15; // g'ishtlar orasidagi kechikish
const FALL = 0.35;
const DROP = 0.7;

const rowStart = (r: number) => START + r * PER_ROW * EACH;
const brickY = (r: number) => FOOTING_TOP + BRICK.gapY + r * STEP_Y + BRICK.h / 2;
const brickX = (r: number, j: number) =>
  WALL_X + (j - (PER_ROW - 1) / 2) * STEP_X + (r % 2 ? 0.1 : -0.1);

const END = START + ROWS * PER_ROW * EACH + FALL;

/** Qorishma surtish va g'isht qo'yish harakati. */
function pose(t: number): WorkerPose {
  const active = seg(t, 0.1, 0.4) * (1 - seg(t, END, END + 0.5));
  const stroke = Math.sin(t * Math.PI * 2 * (1 / EACH / 2)) * 0.5 + 0.5;
  return {
    torso: [0.18 * active, 0, 0],
    rightArm: [-1.15 * active - 0.25 * stroke * active, 0, -0.15 * active],
    leftArm: [-0.5 * active, 0, 0.1 * active],
    head: [0.2 * active, 0, 0],
  };
}

function Trowel() {
  return (
    <group rotation-x={-0.6}>
      <mesh position={[0, -0.05, 0]} material={mat("wood")}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
      </mesh>
      <mesh position={[0, -0.11, 0.08]} material={mat("steel", { metalness: 0.5, roughness: 0.4 })}>
        <RBoxGeo args={[0.14, 0.012, 0.2]} />
      </mesh>
    </group>
  );
}

export default function Bricklayer({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const bricks = useRef<(Mesh | null)[]>([]);
  const mortar = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const t = time.current;

    // Har qator oldidan kulrang qorishma qatlami chapdan o'ngga surtiladi
    mortar.current.forEach((g, r) => {
      if (!g) return;
      const s = seg(t, rowStart(r) - 0.3, rowStart(r) - 0.02);
      g.visible = s > 0;
      g.scale.x = Math.max(s, 0.001);
    });

    // G'ishtlar birma-bir yuqoridan tushib, joyiga "o'tiradi"
    bricks.current.forEach((m, i) => {
      if (!m) return;
      const r = Math.floor(i / PER_ROW);
      const start = START + i * EACH;
      const s = seg(t, start, start + FALL);
      m.visible = t >= start;
      m.position.y = brickY(r) + DROP * (1 - easeOutBounce(s));
      const squash = pulse(seg(s, 0.35, 0.6)) * 0.12;
      m.scale.set(1 + squash / 2, 1 - squash, 1);
    });
  });

  return (
    <group>
      {/* Poydevor tasmasi */}
      <mesh position={[WALL_X, FOOTING_TOP / 2, WALL_Z]} receiveShadow={shadows} castShadow={shadows} material={mat("concrete")}>
        <RBoxGeo args={[PER_ROW * STEP_X + 0.4, FOOTING_TOP, BRICK.d + 0.16]} />
      </mesh>

      {Array.from({ length: ROWS }, (_, r) => (
        <group
          key={r}
          ref={(el) => (mortar.current[r] = el)}
          position={[WALL_X - (PER_ROW * STEP_X) / 2 + (r % 2 ? 0.1 : -0.1), brickY(r) - BRICK.h / 2 - BRICK.gapY / 2, WALL_Z]}
          visible={false}
        >
          <mesh position-x={(PER_ROW * STEP_X) / 2} material={mat("mortar")}>
            <RBoxGeo args={[PER_ROW * STEP_X, BRICK.gapY, BRICK.d - 0.02]} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: ROWS * PER_ROW }, (_, i) => {
        const r = Math.floor(i / PER_ROW);
        const j = i % PER_ROW;
        return (
          <mesh
            key={i}
            ref={(el) => (bricks.current[i] = el)}
            position={[brickX(r, j), brickY(r), WALL_Z]}
            visible={false}
            castShadow={shadows}
            receiveShadow={shadows}
            material={mat("brick")}
          >
            <RBoxGeo args={[BRICK.l, BRICK.h, BRICK.d]} />
          </mesh>
        );
      })}

      {/* Yonida g'isht taxi */}
      <group position={[-1.6, 0, 0.75]}>
        {[0, 1, 2].map((k) => (
          <mesh key={k} position={[0, 0.09 + k * 0.19, 0]} rotation-y={k % 2 ? 0.1 : -0.05} castShadow={shadows} material={mat("brick")}>
            <RBoxGeo args={[0.6, 0.18, 0.42]} />
          </mesh>
        ))}
      </group>

      <Worker
        position={[1.75, 0, 0.4]}
        rotationY={-Math.PI / 2 + 0.55}
        pose={pose}
        rightHand={<Trowel />}
        shadows={shadows}
      />
    </group>
  );
}
