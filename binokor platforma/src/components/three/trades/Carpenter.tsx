import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeInOut, easeOut, lerp, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const OPEN_W = 0.9; // eshik o'rni kengligi
const OPEN_H = 1.95;
const JAMB = 0.1;
const DEPTH = 0.14;
const LEAF = { w: OPEN_W - 0.02, h: OPEN_H - 0.03, d: 0.05 };

type V3 = [number, number, number];

/** Rom qismlari: havodagi boshlang'ich holat → joyi. */
const PARTS: { size: V3; to: V3; from: V3; spin: V3; at: number }[] = [
  { size: [JAMB, OPEN_H + JAMB, DEPTH], to: [-(OPEN_W + JAMB) / 2, (OPEN_H + JAMB) / 2, 0], from: [-1.4, 1.9, 0.8], spin: [0.9, 1.4, 0.6], at: 0.3 },
  { size: [JAMB, OPEN_H + JAMB, DEPTH], to: [(OPEN_W + JAMB) / 2, (OPEN_H + JAMB) / 2, 0], from: [0.5, 2.3, -1.0], spin: [-0.7, -1.2, 0.8], at: 0.75 },
  { size: [OPEN_W + JAMB * 2, JAMB, DEPTH], to: [0, OPEN_H + JAMB * 1.5, 0], from: [-0.5, 2.55, 0.5], spin: [0.5, 0.9, -1.1], at: 1.2 },
];
const FLY = 0.6;
const LEAF_IN = [2.0, 2.8] as const;
const OPEN = [3.0, 3.6] as const;
const CLOSE = [3.9, 4.5] as const;

function pose(t: number): WorkerPose {
  const hammer = seg(t, 0.2, 0.4) * (1 - seg(t, 1.9, 2.2));
  const hit = Math.abs(Math.sin(t * 9)) * hammer;
  const push = seg(t, LEAF_IN[0], LEAF_IN[0] + 0.2) * (1 - seg(t, LEAF_IN[1], LEAF_IN[1] + 0.3));
  return {
    rightArm: [-1.9 * hammer + 0.7 * hit - 1.1 * push, 0, -0.15],
    leftArm: [-0.6 * hammer - 1.0 * push, 0, 0.15],
    head: [-0.15 * hammer, 0, 0],
  };
}

function Hammer() {
  return (
    <group rotation-x={-1.2}>
      <mesh position-y={-0.1} material={mat("wood")}>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 16]} />
      </mesh>
      <mesh position-y={-0.22} rotation-z={Math.PI / 2} material={mat("steel", { metalness: 0.5 })}>
        <RBoxGeo args={[0.05, 0.14, 0.05]} />
      </mesh>
    </group>
  );
}

export default function Carpenter({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const parts = useRef<(Group | null)[]>([]);
  const leafSlide = useRef<Group>(null);
  const hinge = useRef<Group>(null);

  useFrame(() => {
    const t = time.current;

    // Yog'och qismlar havoda yig'ilib, rom hosil qiladi
    parts.current.forEach((g, i) => {
      if (!g) return;
      const p = PARTS[i];
      const s = easeInOut(seg(t, p.at, p.at + FLY));
      g.visible = t >= p.at - 0.25;
      const appear = easeOut(seg(t, p.at - 0.25, p.at));
      g.position.set(lerp(p.from[0], p.to[0], s), lerp(p.from[1], p.to[1], s), lerp(p.from[2], p.to[2], s));
      g.rotation.set(p.spin[0] * (1 - s), p.spin[1] * (1 - s), p.spin[2] * (1 - s));
      g.scale.setScalar(Math.max(appear, 0.001));
    });

    // Eshik tabaqasi o'ng tomondan kirib o'rnashadi, keyin ochilib-yopiladi
    if (leafSlide.current) {
      const s = easeOut(seg(t, LEAF_IN[0], LEAF_IN[1]));
      leafSlide.current.visible = t >= LEAF_IN[0];
      leafSlide.current.position.x = lerp(1.6, 0, s);
      leafSlide.current.position.z = lerp(0.5, 0, s);
    }
    if (hinge.current) {
      const open = easeInOut(seg(t, OPEN[0], OPEN[1])) * (1 - easeInOut(seg(t, CLOSE[0], CLOSE[1])));
      hinge.current.rotation.y = -1.15 * open;
    }
  });

  const wood = mat("wood");

  return (
    <group rotation-y={0.45} position-x={-0.1}>
      {/* Pol bo'sag'asi */}
      <mesh position={[0, 0.02, 0]} receiveShadow={shadows} material={mat("concrete")}>
        <RBoxGeo args={[OPEN_W + JAMB * 2 + 0.2, 0.04, DEPTH + 0.1]} />
      </mesh>

      {PARTS.map((p, i) => (
        <group key={i} ref={(el) => (parts.current[i] = el)} visible={false}>
          <mesh castShadow={shadows} receiveShadow={shadows} material={wood}>
            <RBoxGeo args={p.size} />
          </mesh>
        </group>
      ))}

      {/* Tabaqa: chap romga osilgan (lo'kidon) */}
      <group ref={leafSlide} visible={false}>
        <group ref={hinge} position={[-OPEN_W / 2 + 0.01, 0.04, 0]}>
          <group position={[LEAF.w / 2, LEAF.h / 2, 0]}>
            <mesh castShadow={shadows} receiveShadow={shadows} material={mat("#C08A55")}>
              <RBoxGeo args={[LEAF.w, LEAF.h, LEAF.d]} />
            </mesh>
            {/* Panel naqshi */}
            {[0.45, -0.4].map((y) => (
              <mesh key={y} position={[0, y, LEAF.d / 2 + 0.005]} material={wood}>
                <RBoxGeo args={[LEAF.w - 0.24, 0.6, 0.012]} />
              </mesh>
            ))}
            <mesh position={[LEAF.w / 2 - 0.1, -0.02, LEAF.d / 2 + 0.03]} material={mat("amber", { metalness: 0.5, roughness: 0.35 })}>
              <sphereGeometry args={[0.035, 16, 12]} />
            </mesh>
          </group>
        </group>
      </group>

      <Worker position={[1.25, 0, 0.7]} rotationY={-Math.PI / 2 - 0.5} pose={pose} rightHand={<Hammer />} shadows={shadows} />
    </group>
  );
}
