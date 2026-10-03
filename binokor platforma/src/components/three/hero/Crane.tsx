import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CylinderGeometry,
  Matrix4,
  Quaternion,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh,
} from "three";
import { mat } from "../Materials";
import { roundedBox } from "../RBox";
import { CRANE_POS, JIB_LEN, RADIUS, TOWER_H, sceneAt } from "./timeline";

type P3 = [number, number, number];
/** Panjara trubasi: a → b, radius r */
type Strut = [P3, P3, number];

const APEX_H = 3.6;
const COUNTER_LEN = 5;
const HALF = 0.6; // minora kesimining yarmi
const JIB_W = 0.45; // strela pastki belbog'larining yarim kengligi
const JIB_TOP = 0.85;

const UNIT_CYL = new CylinderGeometry(1, 1, 1, 8);
const UP = new Vector3(0, 1, 0);

/** Minora: 4 ta asosiy belbog', har 2 m da gorizontal va diagonal bog'lovchilar. */
function towerStruts(): Strut[] {
  const s: Strut[] = [];
  const c: [number, number][] = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]];
  const SEC = 2;
  const n = Math.round(TOWER_H / SEC);
  c.forEach(([x, z]) => s.push([[x, 0, z], [x, TOWER_H, z], 0.07]));
  for (let i = 0; i <= n; i++) {
    const y = i * SEC;
    for (let f = 0; f < 4; f++) {
      const a = c[f];
      const b = c[(f + 1) % 4];
      s.push([[a[0], y, a[1]], [b[0], y, b[1]], 0.035]);
      if (i < n) {
        const flip = (i + f) % 2 === 0;
        s.push([
          [(flip ? a : b)[0], y, (flip ? a : b)[1]],
          [(flip ? b : a)[0], y + SEC, (flip ? b : a)[1]],
          0.03,
        ]);
      }
    }
  }
  // Cho'qqi (A-ramka)
  c.forEach(([x, z]) => s.push([[x, TOWER_H, z], [0, TOWER_H + APEX_H, 0], 0.06]));
  return s;
}

/** Strela (uchburchak kesim) va qarshi strela — strela guruhiga nisbatan. */
function jibStruts(): Strut[] {
  const s: Strut[] = [];
  const SEC = 1;
  [-JIB_W, JIB_W].forEach((z) => s.push([[0, 0, z], [JIB_LEN, 0, z], 0.06]));
  s.push([[0, JIB_TOP, 0], [JIB_LEN - 0.6, JIB_TOP, 0], 0.06]);
  s.push([[JIB_LEN - 0.6, JIB_TOP, 0], [JIB_LEN, 0, 0], 0.05]);
  for (let i = 0; i < JIB_LEN / SEC; i++) {
    const x0 = i * SEC;
    const x1 = x0 + SEC;
    s.push([[x0, 0, -JIB_W], [x0, 0, JIB_W], 0.03]);
    [-JIB_W, JIB_W].forEach((z) => {
      if (x1 <= JIB_LEN - 0.6) s.push([[i % 2 ? x0 : x1, 0, z], [i % 2 ? x1 : x0, JIB_TOP, 0], 0.028]);
    });
    s.push([[x0, 0, -JIB_W], [x1, 0, JIB_W], 0.022]);
  }
  // Qarshi strela: tekis panjara
  [-JIB_W, JIB_W].forEach((z) => s.push([[-COUNTER_LEN, 0, z], [0, 0, z], 0.06]));
  for (let i = 0; i <= COUNTER_LEN; i++) {
    s.push([[-i, 0, -JIB_W], [-i, 0, JIB_W], 0.03]);
  }
  // Troslar: cho'qqidan strela uchiga va qarshi strela oxiriga
  const apex: P3 = [0, APEX_H, 0];
  [-0.05, 0.05].forEach((z) => {
    s.push([[apex[0], apex[1], z], [JIB_LEN * 0.72, JIB_TOP, z], 0.02]);
    s.push([[apex[0], apex[1], z], [-COUNTER_LEN + 0.4, 0, z], 0.02]);
  });
  return s;
}

/** Ko'p ingichka trubalarni bitta InstancedMesh bilan chizadi. */
function Lattice({ struts, shadows }: { struts: Strut[]; shadows: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const a = new Vector3();
    const b = new Vector3();
    const dir = new Vector3();
    const q = new Quaternion();
    const mtx = new Matrix4();
    const scl = new Vector3();
    struts.forEach(([p0, p1, r], i) => {
      a.set(...p0);
      b.set(...p1);
      dir.subVectors(b, a);
      const len = dir.length();
      q.setFromUnitVectors(UP, dir.normalize());
      scl.set(r, len, r);
      mtx.compose(a.clone().add(b).multiplyScalar(0.5), q, scl);
      m.setMatrixAt(i, mtx);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [struts]);
  return (
    <instancedMesh
      ref={ref}
      args={[UNIT_CYL, undefined, struts.length]}
      material={mat("amber")}
      castShadow={shadows}
    />
  );
}

export function Crane({
  progress,
  shadows,
}: {
  progress: MutableRefObject<number>;
  shadows: boolean;
}) {
  const root = useRef<Group>(null);
  const jib = useRef<Group>(null);
  const cables = useRef<(Mesh | null)[]>([]);
  const hook = useRef<Group>(null);
  const signalMat = mat("signal", { emissive: "#FF3B30", emissiveIntensity: 2 });
  const tower = useMemo(towerStruts, []);
  const jibLattice = useMemo(jibStruts, []);

  useFrame(({ clock }) => {
    const { crane } = sceneAt(progress.current);
    if (!root.current || !jib.current) return;
    root.current.visible = crane.visible;
    if (!crane.visible) return;
    root.current.position.y = crane.riseY;
    jib.current.rotation.y = -crane.phi;

    // Ilgak bloki va troslar: arava ostida, hookY balandlikda
    const hookLocal = crane.hookY - TOWER_H;
    if (hook.current) hook.current.position.y = hookLocal;
    const top = -0.35;
    const bottom = hookLocal + 0.35;
    const len = Math.max(top - bottom, 0.01);
    cables.current.forEach((c) => {
      if (!c) return;
      c.scale.y = len;
      c.position.y = (top + bottom) / 2;
    });

    // Cho'qqidagi qizil signal chirog'i miltillaydi
    const on = Math.floor(clock.elapsedTime / 0.6) % 2 === 0;
    signalMat.emissiveIntensity = on ? 2.6 : 0.1;
  });

  const steel = mat("steel");

  return (
    <group ref={root} position={[CRANE_POS.x, 0, CRANE_POS.z]} visible={false}>
      {/* Beton poydevor va anker oyoqlari */}
      <mesh position-y={0.3} castShadow={shadows} receiveShadow={shadows} geometry={roundedBox(3.4, 0.6, 3.4, 0.08)} material={mat("concrete")} />
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x * 0.9, 0.75, z * 0.9]} geometry={roundedBox(0.5, 0.3, 0.5, 0.05)} material={steel} />
      ))}

      <Lattice struts={tower} shadows={shadows} />

      <group ref={jib} position-y={TOWER_H}>
        {/* Aylanuvchi halqa va kabina */}
        <mesh position-y={-0.15} material={steel}>
          <cylinderGeometry args={[0.95, 0.95, 0.3, 24]} />
        </mesh>
        <group position={[0.6, -0.95, 1.05]}>
          <mesh castShadow={shadows} geometry={roundedBox(1.3, 1.25, 1.1, 0.14)} material={mat("paper", { roughness: 0.4 })} />
          <mesh position={[0.66, 0.12, 0]} geometry={roundedBox(0.04, 0.6, 0.9, 0.02)} material={mat("glass")} />
          <mesh position={[0, 0.12, 0.56]} geometry={roundedBox(1.0, 0.6, 0.04, 0.02)} material={mat("glass")} />
        </group>

        <Lattice struts={jibLattice} shadows={shadows} />

        {/* Qarshi strela yo'lagi va yuk bloklari */}
        <mesh position={[-COUNTER_LEN / 2, 0.06, 0]} geometry={roundedBox(COUNTER_LEN, 0.06, JIB_W * 2, 0.02)} material={steel} />
        {[0, 1, 2].map((k) => (
          <mesh
            key={k}
            position={[-COUNTER_LEN + 0.55 + k * 0.62, -0.45, 0]}
            castShadow={shadows}
            geometry={roundedBox(0.56, 1.3, 1.2, 0.06)}
            material={mat("concrete")}
          />
        ))}

        {/* Cho'qqidagi signal chirog'i */}
        <mesh position-y={APEX_H + 0.15} material={signalMat}>
          <sphereGeometry args={[0.2, 16, 12]} />
        </mesh>

        {/* Arava (trolley) */}
        <group position={[RADIUS, -0.15, 0]}>
          <mesh geometry={roundedBox(0.9, 0.3, 1.05, 0.06)} material={steel} />
          {[-0.3, 0.3].map((x) =>
            [-0.42, 0.42].map((z) => (
              <mesh key={`${x}${z}`} position={[x, 0.17, z]} rotation-x={Math.PI / 2} material={mat("rubber")}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
              </mesh>
            )),
          )}
        </group>

        {/* Troslar */}
        {[-0.12, 0.12].map((z, i) => (
          <mesh key={z} ref={(el) => (cables.current[i] = el)} position={[RADIUS, 0, z]} material={mat("rubber")}>
            <cylinderGeometry args={[0.018, 0.018, 1, 8]} />
          </mesh>
        ))}

        {/* Ilgak bloki: shkiv, korpus, ilgak */}
        <group ref={hook} position-x={RADIUS}>
          <mesh rotation-x={Math.PI / 2} material={steel}>
            <cylinderGeometry args={[0.24, 0.24, 0.32, 20]} />
          </mesh>
          <mesh position-y={-0.2} castShadow={shadows} geometry={roundedBox(0.5, 0.36, 0.42, 0.08)} material={mat("amber")} />
          <mesh position-y={-0.48} rotation-x={Math.PI / 2} material={steel}>
            <torusGeometry args={[0.11, 0.035, 10, 20, Math.PI * 1.4]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
