import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  PointsMaterial,
  type Group,
  type Mesh,
  type Points,
} from "three";
import { mat } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeInOut, easeOut, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const PIPE_Y = 1.0;
const PIPE_Z = -0.15;
const R = 0.07;
const GAP = { from: -0.25, to: 0.25 }; // almashtiriladigan bo'lak
const TAP: [number, number, number] = [1.05, 0.72, PIPE_Z + 0.02];

const LEAK_END = 1.4; // eski bo'lak olinadi — tomchilar to'xtaydi
const REMOVE = [1.2, 2.0] as const;
const INSERT = [2.1, 2.9] as const;
const FLOW = 3.1;
const DROPS = 6;
const STREAM = 36;
const WATER = "#4FA3E0";

function pose(t: number): WorkerPose {
  const work = seg(t, 0.8, 1.2) * (1 - seg(t, INSERT[1] + 0.2, INSERT[1] + 0.6));
  const turn = Math.sin(t * 7) * 0.15 * work;
  return {
    rightArm: [-1.75 * work + turn, 0, -0.15 * work],
    leftArm: [-1.6 * work, 0, 0.2 * work],
    head: [-0.2 * work, 0, 0],
  };
}

function Wrench() {
  return (
    <group rotation-x={-0.9}>
      <mesh position-y={-0.1} material={mat("steel", { metalness: 0.5, roughness: 0.4 })}>
        <RBoxGeo args={[0.04, 0.24, 0.02]} />
      </mesh>
      <mesh position-y={-0.24} material={mat("steel", { metalness: 0.5, roughness: 0.4 })}>
        <RBoxGeo args={[0.1, 0.05, 0.03]} />
      </mesh>
    </group>
  );
}

/** Gorizontal quvur bo'lagi (x1 → x2). */
function Pipe({ x1, x2, material }: { x1: number; x2: number; material: ReturnType<typeof mat> }) {
  return (
    <mesh position={[(x1 + x2) / 2, 0, 0]} rotation-z={Math.PI / 2} material={material}>
      <cylinderGeometry args={[R, R, x2 - x1, 16]} />
    </mesh>
  );
}

export default function Plumber({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const oldPart = useRef<Group>(null);
  const newPart = useRef<Group>(null);
  const drops = useRef<(Mesh | null)[]>([]);
  const puddle = useRef<Mesh>(null);

  const stream = useMemo(() => {
    const pos = new Float32Array(STREAM * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    return { geo, pos, material: new PointsMaterial({ color: WATER, size: 0.05, sizeAttenuation: true }) };
  }, []);
  const streamRef = useRef<Points>(null);

  useFrame(() => {
    const t = time.current;

    // Eski (zanglagan) bo'lak pastga olinib, chetga qo'yiladi
    if (oldPart.current) {
      const s = easeInOut(seg(t, REMOVE[0], REMOVE[1]));
      oldPart.current.position.set(0.25 * s, PIPE_Y - 0.9 * s, PIPE_Z + 0.6 * s);
      oldPart.current.rotation.y = s * 0.8;
      oldPart.current.visible = t < INSERT[1];
    }
    // Yangi bo'lak pastdan ko'tarilib joyiga kiradi
    if (newPart.current) {
      const s = easeOut(seg(t, INSERT[0], INSERT[1]));
      newPart.current.visible = t >= INSERT[0];
      newPart.current.position.set(0, PIPE_Y - 0.6 * (1 - s), PIPE_Z + 0.45 * (1 - s));
    }

    // Yoriqdan tomchilar
    const leaking = t < LEAK_END;
    drops.current.forEach((m, i) => {
      if (!m) return;
      const phase = ((t + i * 0.075) % 0.45) / 0.45;
      m.visible = leaking && t > 0.1;
      m.position.set(0.02, PIPE_Y - R - phase * phase * (PIPE_Y - R), PIPE_Z);
    });

    // Ko'lmak: o'sadi, ta'mirdan keyin asta quriydi
    if (puddle.current) {
      const grow = easeOut(seg(t, 0.2, LEAK_END));
      const dry = seg(t, FLOW + 0.5, 5.6);
      const s = Math.max(grow * (1 - dry), 0.001);
      puddle.current.scale.set(s, 1, s * 0.75);
    }

    // Jo'mrakdan suv to'g'ri oqadi
    const flowing = t > FLOW;
    if (streamRef.current) streamRef.current.visible = flowing;
    if (flowing) {
      const p = stream.pos;
      for (let i = 0; i < STREAM; i++) {
        const ph = ((t * 1.6 + i / STREAM) % 1);
        p[i * 3] = TAP[0] + Math.sin(i * 12.9) * 0.015;
        p[i * 3 + 1] = TAP[1] - 0.06 - ph * ph * 0.42;
        p[i * 3 + 2] = TAP[2] + 0.08 + Math.cos(i * 7.3) * 0.015;
      }
      (stream.geo.attributes.position as BufferAttribute).needsUpdate = true;
    }
  });

  const metal = mat("steel", { metalness: 0.5, roughness: 0.35 });
  const fresh = mat("paper", { roughness: 0.4 });

  return (
    <group rotation-y={0.35}>
      {/* Devor va quvur */}
      <mesh position={[-0.1, 0.8, -0.38]} receiveShadow={shadows} material={mat("wall")}>
        <RBoxGeo args={[3.2, 1.6, 0.12]} />
      </mesh>
      <group position={[0, PIPE_Y, PIPE_Z]}>
        <Pipe x1={-1.6} x2={GAP.from} material={metal} />
        <Pipe x1={GAP.to} x2={1.05} material={metal} />
        {[GAP.from, GAP.to].map((x) => (
          <mesh key={x} position-x={x} rotation-z={Math.PI / 2} material={mat("navy")}>
            <cylinderGeometry args={[R + 0.025, R + 0.025, 0.08, 16]} />
          </mesh>
        ))}
        {[-1.1, 0.7].map((x) => (
          <mesh key={x} position={[x, 0, -0.12]} material={mat("steel")}>
            <RBoxGeo args={[0.06, 0.06, 0.2]} />
          </mesh>
        ))}
        {/* Tirsak va pastga tushuvchi quvur */}
        <mesh position={[1.05, 0, 0]} material={metal}>
          <sphereGeometry args={[R + 0.01, 16, 12]} />
        </mesh>
        <mesh position={[1.05, -0.12, 0]} material={metal}>
          <cylinderGeometry args={[R, R, 0.24, 16]} />
        </mesh>
      </group>

      {/* Jo'mrak */}
      <group position={TAP}>
        <mesh material={metal}>
          <RBoxGeo args={[0.12, 0.1, 0.12]} />
        </mesh>
        <mesh position={[0, -0.02, 0.09]} rotation-x={Math.PI / 2} material={metal}>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 16]} />
        </mesh>
        <mesh position={[0, 0.09, 0]} material={mat("signal")}>
          <RBoxGeo args={[0.16, 0.03, 0.03]} />
        </mesh>
      </group>
      <points ref={streamRef} geometry={stream.geo} material={stream.material} visible={false} frustumCulled={false} />
      <mesh position={[TAP[0], 0.12, TAP[2] + 0.1]} castShadow={shadows} material={mat("steel")}>
        <cylinderGeometry args={[0.16, 0.13, 0.24, 16, 1, true]} />
      </mesh>

      {/* Eski bo'lak (yoriq bilan) */}
      <group ref={oldPart}>
        <mesh rotation-z={Math.PI / 2} material={mat("#8B5A3C")}>
          <cylinderGeometry args={[R, R, GAP.to - GAP.from - 0.02, 16]} />
        </mesh>
        <mesh position={[0.02, -R + 0.005, 0]} material={mat("navy")}>
          <RBoxGeo args={[0.1, 0.02, 0.05]} />
        </mesh>
      </group>
      {/* Yangi bo'lak */}
      <group ref={newPart} visible={false}>
        <mesh rotation-z={Math.PI / 2} material={fresh}>
          <cylinderGeometry args={[R, R, GAP.to - GAP.from - 0.02, 16]} />
        </mesh>
      </group>

      {Array.from({ length: DROPS }, (_, i) => (
        <mesh key={i} ref={(el) => (drops.current[i] = el)} visible={false} material={mat(WATER)}>
          <sphereGeometry args={[0.025, 16, 12]} />
        </mesh>
      ))}
      <mesh ref={puddle} position={[0.02, 0.005, PIPE_Z + 0.1]} material={mat(WATER, { roughness: 0.2 })}>
        <cylinderGeometry args={[0.45, 0.45, 0.01, 16]} />
      </mesh>

      <Worker position={[-0.85, 0, 0.45]} rotationY={Math.PI - 0.55} pose={pose} rightHand={<Wrench />} shadows={shadows} />
    </group>
  );
}
