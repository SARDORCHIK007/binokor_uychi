import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3, type Group, type Mesh } from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeInOut, easeOut, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const FORM = { w: 1.8, d: 1.0, h: 0.5, t: 0.06 };
const LEVEL = { from: 0.02, to: 0.42 };
const POUR = [0.5, 2.8] as const;
const SMOOTH = [3.0, 4.5] as const;
const CHUTE_LIP: [number, number, number] = [-0.55, 1.05, 0];

/** Sirtdagi notekisliklar (andava o'tganda yo'qoladi). */
const BUMPS: [number, number, number][] = [
  [-0.65, -0.2, 0.09],
  [-0.35, 0.25, 0.07],
  [-0.1, -0.1, 0.1],
  [0.2, 0.3, 0.08],
  [0.45, -0.25, 0.09],
  [0.7, 0.1, 0.07],
  [-0.55, 0.3, 0.06],
  [0.05, 0.32, 0.06],
];

const UP = new Vector3(0, 1, 0);
const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpQ = new Quaternion();

/** Silindrni ikki nuqta orasiga joylashtiradi (andava dastasi). */
function placeBetween(m: Mesh, a: Vector3, b: Vector3) {
  const dir = tmpA.copy(b).sub(a);
  const len = dir.length();
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.copy(tmpQ.setFromUnitVectors(UP, dir.normalize()));
  m.scale.set(1, len, 1);
}

const level = (t: number) =>
  LEVEL.from + (LEVEL.to - LEVEL.from) * easeOut(seg(t, POUR[0] + 0.2, POUR[1]));

/** Andava sirt bo'ylab: o'ngdan chapga o'tadi, oldinga-orqaga suriladi. */
function floatPos(t: number): [number, number] {
  const s = seg(t, SMOOTH[0], SMOOTH[1]);
  const x = 0.75 - 1.5 * easeInOut(s);
  const z = Math.sin(s * Math.PI * 6) * 0.32;
  return [x, z];
}

function pose(t: number): WorkerPose {
  const work = seg(t, SMOOTH[0] - 0.3, SMOOTH[0]) * (1 - seg(t, SMOOTH[1], SMOOTH[1] + 0.4));
  const watch = seg(t, 0.3, 0.6) * (1 - seg(t, SMOOTH[0] - 0.3, SMOOTH[0]));
  const [, z] = floatPos(t);
  return {
    torso: [0.25 * work + 0.05 * watch, 0, 0],
    rightArm: [-0.95 * work, 0, -0.25 * work + z * 0.4 * work],
    leftArm: [-0.85 * work, 0, 0.25 * work + z * 0.4 * work],
    head: [0.25 * (work + watch), 0, 0],
  };
}

export default function Concrete({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const fill = useRef<Mesh>(null);
  const stream = useRef<Mesh>(null);
  const chuteFlow = useRef<Mesh>(null);
  const bumps = useRef<(Mesh | null)[]>([]);
  const floatRef = useRef<Group>(null);
  const pole = useRef<Mesh>(null);
  const hand = useMemo(() => new Vector3(1.0, 1.0, 0.15), []);

  useFrame(() => {
    const t = time.current;
    const lv = level(t);

    if (fill.current) {
      fill.current.scale.y = lv;
      fill.current.position.y = lv / 2;
    }

    // Tarnovdan oqim
    const pouring = t > POUR[0] && t < POUR[1];
    if (stream.current) {
      stream.current.visible = pouring;
      const top = CHUTE_LIP[1];
      const len = Math.max(top - lv, 0.01) * easeOut(seg(t, POUR[0], POUR[0] + 0.2));
      stream.current.scale.y = len;
      stream.current.position.y = top - len / 2;
    }
    if (chuteFlow.current) chuteFlow.current.visible = t > POUR[0] - 0.2 && t < POUR[1] - 0.1;

    // Notekisliklar: quyilganda paydo bo'ladi, andava o'tganda silliqlanadi
    const [fx, fz] = floatPos(t);
    bumps.current.forEach((m, i) => {
      if (!m) return;
      const [bx, , size] = BUMPS[i];
      const appear = seg(t, POUR[0] + 0.6 + i * 0.15, POUR[0] + 0.9 + i * 0.15);
      const smoothed = t > SMOOTH[0] && fx < bx - 0.05 ? 1 : 0;
      const flat = t > SMOOTH[1] ? 1 : smoothed;
      const s = appear * (1 - flat);
      m.visible = s > 0.01;
      m.scale.set(size * 2.2, size * s, size * 2.2);
      m.position.y = lv;
    });

    // Andava va uning dastasi
    const smoothing = t > SMOOTH[0] - 0.3 && t < SMOOTH[1] + 0.3;
    if (floatRef.current && pole.current) {
      floatRef.current.visible = smoothing;
      pole.current.visible = smoothing;
      if (smoothing) {
        floatRef.current.position.set(fx, lv + 0.02, fz);
        placeBetween(pole.current, hand, tmpB.set(fx, lv + 0.06, fz));
      }
    }
  });

  const wood = mat("wood");
  const { w, d, h, t: th } = FORM;

  return (
    <group>
      {/* Yog'och qolip */}
      {[1, -1].map((s) => (
        <mesh key={`z${s}`} position={[0, h / 2, s * (d / 2 + th / 2)]} castShadow={shadows} receiveShadow={shadows} material={wood}>
          <RBoxGeo args={[w + th * 2, h, th]} />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh key={`x${s}`} position={[s * (w / 2 + th / 2), h / 2, 0]} castShadow={shadows} receiveShadow={shadows} material={wood}>
          <RBoxGeo args={[th, h, d]} />
        </mesh>
      ))}

      {/* Beton */}
      <mesh ref={fill} receiveShadow={shadows} material={mat("wetConcrete")}>
        <RBoxGeo args={[w, 1, d]} />
      </mesh>
      {BUMPS.map(([x, z], i) => (
        <mesh key={i} ref={(el) => (bumps.current[i] = el)} position={[x, 0, z]} visible={false} material={mat("wetConcrete")}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
      ))}

      {/* Tarnov va tayanch */}
      <group position={[-1.3, 1.35, 0]} rotation-z={-0.42}>
        <mesh castShadow={shadows} material={mat("steel")}>
          <RBoxGeo args={[1.7, 0.05, 0.32]} />
        </mesh>
        {[1, -1].map((s) => (
          <mesh key={s} position={[0, 0.07, s * 0.16]} material={mat("steel")}>
            <RBoxGeo args={[1.7, 0.14, 0.03]} />
          </mesh>
        ))}
        <mesh ref={chuteFlow} position={[0, 0.045, 0]} visible={false} material={mat("wetConcrete")}>
          <RBoxGeo args={[1.66, 0.04, 0.26]} />
        </mesh>
      </group>
      {[-0.35, 0.35].map((z) => (
        <mesh key={z} position={[-1.85, 0.8, z * 0.6]} castShadow={shadows} material={mat("steel")}>
          <RBoxGeo args={[0.06, 1.6, 0.06]} />
        </mesh>
      ))}
      <mesh ref={stream} position={[CHUTE_LIP[0], 0, CHUTE_LIP[2]]} visible={false} material={mat("wetConcrete")}>
        <cylinderGeometry args={[0.09, 0.11, 1, 16]} />
      </mesh>

      {/* Andava (bull float) */}
      <group ref={floatRef} visible={false}>
        <mesh material={mat("steel", { metalness: 0.4, roughness: 0.4 })}>
          <RBoxGeo args={[0.12, 0.03, 0.5]} />
        </mesh>
      </group>
      <mesh ref={pole} visible={false} material={mat("wood")}>
        <cylinderGeometry args={[0.018, 0.018, 1, 16]} />
      </mesh>

      <Worker position={[1.45, 0, 0.3]} rotationY={-Math.PI / 2 + 0.35} pose={pose} shadows={shadows} />
    </group>
  );
}
