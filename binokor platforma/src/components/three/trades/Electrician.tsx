import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial, type Group, type Mesh, type PointLight } from "three";
import { mat, COLORS } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeOutBack, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const WALL = { w: 2.8, h: 2.2, d: 0.2, z: -0.4 };
const FACE_Z = WALL.z + WALL.d / 2 + 0.02;
const WIRE_T = 0.045;

const J: [number, number] = [0, 2.0]; // ulanish qutisi
const SWITCH: [number, number] = [-0.5, 1.15];
const SOCKET: [number, number] = [0.7, 0.35];

/** Kabel yo'li: qutidan kalitga, keyin qutidan rozetkaga. */
const PATH: [number, number][][] = [
  [J, [SWITCH[0], J[1]], [SWITCH[0], SWITCH[1] + 0.14]],
  [J, [SOCKET[0], J[1]], [SOCKET[0], SOCKET[1] + 0.13]],
];
const SEGMENTS = PATH.flatMap((line) =>
  line.slice(1).map((p, i) => ({ a: line[i], b: p, len: Math.hypot(p[0] - line[i][0], p[1] - line[i][1]) })),
);
const TOTAL = SEGMENTS.reduce((s, x) => s + x.len, 0);

const WIRE = [0.4, 2.4] as const;
const SOCKET_IN = [2.45, 2.8] as const;
const SWITCH_IN = [2.8, 3.15] as const;
const PRESS = 3.5;

function pose(t: number): WorkerPose {
  const wiring = seg(t, 0.2, 0.4) * (1 - seg(t, WIRE[1], WIRE[1] + 0.3));
  const press = seg(t, PRESS - 0.4, PRESS - 0.1) * (1 - seg(t, PRESS + 0.3, PRESS + 0.7));
  const wiggle = Math.sin(t * 9) * 0.12 * wiring;
  return {
    rightArm: [-2.5 * wiring - 1.35 * press + wiggle, 0, -0.1],
    leftArm: [-0.3 * wiring, 0, 0.1],
    head: [-0.35 * wiring + 0.05 * press, 0, 0],
  };
}

function Screwdriver() {
  return (
    <group rotation-x={-1.3}>
      <mesh position-y={-0.05} material={mat("amber")}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
      </mesh>
      <mesh position-y={-0.14} material={mat("steel")}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 16]} />
      </mesh>
    </group>
  );
}

export default function Electrician({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const wires = useRef<(Group | null)[]>([]);
  const socket = useRef<Group>(null);
  const sw = useRef<Group>(null);
  const rocker = useRef<Mesh>(null);
  const lamp = useRef<PointLight>(null);
  const bulbMat = useMemo(
    () => new MeshStandardMaterial({ color: "#F4F1E6", emissive: COLORS.warmLight, emissiveIntensity: 0, flatShading: false }),
    [],
  );

  useFrame(() => {
    const t = time.current;

    // Sim kabel yo'li bo'ylab tortiladi
    let drawn = seg(t, WIRE[0], WIRE[1]) * TOTAL;
    wires.current.forEach((g, i) => {
      if (!g) return;
      const s = Math.min(Math.max(drawn / SEGMENTS[i].len, 0), 1);
      drawn -= SEGMENTS[i].len;
      g.visible = s > 0;
      g.scale.x = Math.max(s, 0.001);
    });

    const pop = (r: readonly [number, number]) => Math.max(easeOutBack(seg(t, r[0], r[1])), 0.0001);
    socket.current?.scale.setScalar(pop(SOCKET_IN));
    sw.current?.scale.setScalar(pop(SWITCH_IN));

    // Kalit bosiladi — lampochka yonadi
    const on = t >= PRESS;
    if (rocker.current) rocker.current.rotation.x = on ? -0.3 : 0.3;
    const glow = seg(t, PRESS, PRESS + 0.25);
    bulbMat.emissiveIntensity = glow * 2.2;
    if (lamp.current) lamp.current.intensity = glow * 3;
  });

  const white = mat("white");

  return (
    // Devor yuzasi kameraga qaragan bo'lishi uchun sahna biroz burilgan
    <group rotation-y={0.6} position-x={0.25}>
      {/* Devor kesimi va shift */}
      <mesh position={[0, WALL.h / 2, WALL.z]} castShadow={shadows} receiveShadow={shadows} material={mat("wall")}>
        <RBoxGeo args={[WALL.w, WALL.h, WALL.d]} />
      </mesh>
      <mesh position={[0, WALL.h + 0.06, WALL.z + 0.35]} castShadow={shadows} material={mat("concrete")}>
        <RBoxGeo args={[WALL.w, 0.12, 0.9]} />
      </mesh>

      {/* Kabel yo'li (shtroba) va sim */}
      {SEGMENTS.map(({ a, b, len }, i) => {
        const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
        return (
          <group key={i} position={[a[0], a[1], FACE_Z - 0.015]} rotation-z={angle}>
            <mesh position-x={len / 2} material={mat("mortar")}>
              <RBoxGeo args={[len + 0.08, 0.09, 0.01]} />
            </mesh>
            <group ref={(el) => (wires.current[i] = el)} visible={false}>
              <mesh position={[len / 2, 0, 0.015]} material={mat("copper")}>
                <RBoxGeo args={[len + WIRE_T, WIRE_T, WIRE_T]} />
              </mesh>
            </group>
          </group>
        );
      })}
      <mesh position={[J[0], J[1], FACE_Z]} material={mat("steel")}>
        <RBoxGeo args={[0.18, 0.18, 0.04]} />
      </mesh>

      {/* Rozetka */}
      <group ref={socket} position={[SOCKET[0], SOCKET[1], FACE_Z + 0.02]}>
        <mesh material={white}>
          <RBoxGeo args={[0.24, 0.24, 0.05]} />
        </mesh>
        {[-0.045, 0.045].map((x) => (
          <mesh key={x} position={[x, 0, 0.026]} rotation-x={Math.PI / 2} material={mat("navy")}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
          </mesh>
        ))}
      </group>

      {/* Kalit */}
      <group ref={sw} position={[SWITCH[0], SWITCH[1], FACE_Z + 0.02]}>
        <mesh material={white}>
          <RBoxGeo args={[0.2, 0.26, 0.05]} />
        </mesh>
        <mesh ref={rocker} position-z={0.03} material={mat("amber")}>
          <RBoxGeo args={[0.09, 0.14, 0.03]} />
        </mesh>
      </group>

      {/* Shiftdagi lampochka */}
      <group position={[0, WALL.h, WALL.z + 0.5]}>
        <mesh position-y={-0.15} material={mat("navy")}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 16]} />
        </mesh>
        <mesh position-y={-0.32} material={mat("steel")}>
          <coneGeometry args={[0.14, 0.1, 14, 1, true]} />
        </mesh>
        <mesh position-y={-0.39} material={bulbMat}>
          <sphereGeometry args={[0.07, 16, 12]} />
        </mesh>
        <pointLight ref={lamp} position-y={-0.45} color={COLORS.warmLight} intensity={0} distance={3.5} decay={2} />
      </group>

      <Worker
        position={[-1.45, 0, -0.02]}
        rotationY={2.75}
        pose={pose}
        rightHand={<Screwdriver />}
        shadows={shadows}
      />
    </group>
  );
}
