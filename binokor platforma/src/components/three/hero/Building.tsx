import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { mat } from "../Materials";
import { roundedBox } from "../RBox";
import {
  FLOOR,
  FLOORS,
  FOUNDATION,
  LIT_WINDOWS,
  T,
  WINDOWS_PER_SIDE,
  WINDOW_COUNT,
  easeOut,
  floorBase,
  lightOn,
  sceneAt,
  seg,
  windowGrow,
} from "./timeline";

const WIN = { w: 1.1, h: 1.4, step: 1.8 };
const HALF_H = FLOOR.h / 2;
const FRONT_Z = FLOOR.d / 2;

/** Old tomondagi balkonlar (1–4-qavatlar): x markazlari */
const BALCONY_X = [-3.6, 3.6];

/** Qavatning arxitektura detallari (qavat bloki bilan birga ko'tariladi). */
function FloorDetails({ k, shadows }: { k: number; shadows: boolean }) {
  const rail = mat("#9FB3C8", { roughness: 0.15, metalness: 0.45 });
  const steel = mat("steel");
  return (
    <group>
      {/* Balkonlar: plita, shisha to'siq, tutqich */}
      {k > 0 &&
        BALCONY_X.map((x) => (
          <group key={x} position={[x, -HALF_H, FRONT_Z]}>
            <mesh position={[0, 0.07, 0.47]} castShadow={shadows} receiveShadow={shadows} geometry={roundedBox(3.0, 0.14, 0.95, 0.05)} material={mat("slab")} />
            <mesh position={[0, 0.55, 0.92]} geometry={roundedBox(3.0, 0.8, 0.04, 0.015)} material={rail} />
            {[-1.48, 1.48].map((sx) => (
              <mesh key={sx} position={[sx, 0.55, 0.47]} geometry={roundedBox(0.04, 0.8, 0.95, 0.015)} material={rail} />
            ))}
            <mesh position={[0, 0.97, 0.92]} geometry={roundedBox(3.04, 0.05, 0.07, 0.02)} material={steel} />
          </group>
        ))}

      {/* Kirish: shisha eshik va soyabon (yo'lak tomonda) */}
      {k === 0 && (
        <group position={[-FLOOR.w / 2, -HALF_H, 0]}>
          <mesh position={[-0.02, 1.05, 0]} geometry={roundedBox(0.08, 2.1, 1.9, 0.03)} material={mat("glass")} />
          <mesh position={[-0.03, 1.05, 0]} geometry={roundedBox(0.06, 2.24, 0.08, 0.02)} material={steel} />
          <mesh position={[-0.6, 2.35, 0]} castShadow={shadows} geometry={roundedBox(1.2, 0.12, 2.8, 0.05)} material={mat("concrete")} />
        </group>
      )}

      {/* Tom: parapet, chiqish xonasi, konditsionerlar */}
      {k === FLOORS - 1 && (
        <group position-y={HALF_H}>
          {[
            { p: [0, 0.22, FRONT_Z - 0.08], s: [FLOOR.w, 0.45, 0.16] },
            { p: [0, 0.22, -FRONT_Z + 0.08], s: [FLOOR.w, 0.45, 0.16] },
            { p: [FLOOR.w / 2 - 0.08, 0.22, 0], s: [0.16, 0.45, FLOOR.d] },
            { p: [-FLOOR.w / 2 + 0.08, 0.22, 0], s: [0.16, 0.45, FLOOR.d] },
          ].map(({ p, s: sz }, i) => (
            <mesh
              key={i}
              position={p as [number, number, number]}
              castShadow={shadows}
              geometry={roundedBox(sz[0], sz[1], sz[2], 0.05)}
              material={mat("wall")}
            />
          ))}
          <mesh position={[-3, 0.65, -1.4]} castShadow={shadows} geometry={roundedBox(2.4, 1.3, 1.9, 0.08)} material={mat("wall")} />
          {[1.5, 3.2].map((x) => (
            <mesh key={x} position={[x, 0.3, -1.8]} castShadow={shadows} geometry={roundedBox(1.0, 0.6, 0.7, 0.06)} material={mat("paper", { roughness: 0.5 })} />
          ))}
        </group>
      )}
    </group>
  );
}

/** Deraza i ning joylashuvi: qavat bo'yicha, old va orqa tomonda 6 tadan. */
function windowPos(i: number): [number, number, number] {
  const f = Math.floor(i / (WINDOWS_PER_SIDE * 2));
  const r = i % (WINDOWS_PER_SIDE * 2);
  const side = r < WINDOWS_PER_SIDE ? 1 : -1;
  const j = r % WINDOWS_PER_SIDE;
  const x = (j - (WINDOWS_PER_SIDE - 1) / 2) * WIN.step;
  // Devor yuzasi FLOOR.d/2 - 0.1 da; deraza unga biroz botib turadi
  return [x, floorBase(f) + FLOOR.h / 2 - 0.1, side * (FLOOR.d / 2 - 0.07)];
}

export function Building({
  progress,
  shadows,
}: {
  progress: MutableRefObject<number>;
  shadows: boolean;
}) {
  const foundation = useRef<Mesh>(null);
  const floors = useRef<(Group | null)[]>([]);
  const glass = useRef<InstancedMesh>(null);
  const frames = useRef<InstancedMesh>(null);
  const lit = useRef<InstancedMesh>(null);
  const positions = useMemo(() => Array.from({ length: WINDOW_COUNT }, (_, i) => windowPos(i)), []);
  const dummy = useMemo(() => new Object3D(), []);
  const lastP = useRef(-1);

  // Boshlang'ich holat: barcha derazalar yashirin (scale 0)
  useLayoutEffect(() => {
    [glass.current, frames.current, lit.current].forEach((m) => {
      if (!m) return;
      dummy.scale.setScalar(0);
      for (let i = 0; i < m.count; i++) {
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    });
  }, [dummy]);

  useFrame(() => {
    const p = progress.current;
    if (p === lastP.current) return;
    lastP.current = p;

    // Poydevor pastdan o'sib chiqadi
    const fs = easeOut(seg(p, T.foundation[0], T.foundation[1]));
    if (foundation.current) {
      foundation.current.visible = fs > 0;
      foundation.current.scale.y = Math.max(fs, 0.0001);
      foundation.current.position.y = (FOUNDATION.h / 2) * fs;
    }

    // Qavatlar
    const { floors: states } = sceneAt(p);
    states.forEach((st, k) => {
      const g = floors.current[k];
      if (!g) return;
      g.visible = st.visible && st.grow > 0;
      g.position.set(st.x, st.y, st.z);
      const s = Math.max(st.grow, 0.0001);
      g.scale.set(s * (1 + st.squash / 2), s * (1 - st.squash), s * (1 + st.squash / 2));
    });

    // Derazalar birma-bir
    if (glass.current) {
      for (let i = 0; i < WINDOW_COUNT; i++) {
        const s = windowGrow(p, i);
        dummy.position.set(...positions[i]);
        dummy.scale.setScalar(Math.max(s, 0));
        dummy.updateMatrix();
        glass.current.setMatrixAt(i, dummy.matrix);
        frames.current?.setMatrixAt(i, dummy.matrix);
      }
      glass.current.instanceMatrix.needsUpdate = true;
      if (frames.current) frames.current.instanceMatrix.needsUpdate = true;
    }

    // Derazalarning 60 foizida iliq nur yonadi
    if (lit.current) {
      LIT_WINDOWS.forEach((wi, rank) => {
        const s = lightOn(p, rank);
        const [x, y, z] = positions[wi];
        dummy.position.set(x, y, z + Math.sign(z) * 0.02);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        lit.current!.setMatrixAt(rank, dummy.matrix);
      });
      lit.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh
        ref={foundation}
        visible={false}
        castShadow={shadows}
        receiveShadow={shadows}
        geometry={roundedBox(FOUNDATION.w, FOUNDATION.h, FOUNDATION.d, 0.1)}
        material={mat("concrete")}
      />

      {Array.from({ length: FLOORS }, (_, k) => (
        <group key={k} ref={(el) => (floors.current[k] = el)} visible={false}>
          <mesh
            position-y={-0.15}
            castShadow={shadows}
            receiveShadow={shadows}
            geometry={roundedBox(FLOOR.w - 0.2, FLOOR.h - 0.3, FLOOR.d - 0.2, 0.12)}
            material={mat("wall")}
          />
          <mesh
            position-y={FLOOR.h / 2 - 0.15}
            castShadow={shadows}
            receiveShadow={shadows}
            geometry={roundedBox(FLOOR.w, 0.3, FLOOR.d, 0.1)}
            material={mat("slab")}
          />
          <FloorDetails k={k} shadows={shadows} />
        </group>
      ))}

      {/* Deraza romlari (oq) va ichkariga botgan shisha */}
      <instancedMesh
        ref={frames}
        args={[roundedBox(WIN.w + 0.16, WIN.h + 0.16, 0.09, 0.03), undefined, WINDOW_COUNT]}
        material={mat("paper", { roughness: 0.45 })}
        frustumCulled={false}
      />
      <instancedMesh
        ref={glass}
        args={[roundedBox(WIN.w, WIN.h, 0.06, 0.02), undefined, WINDOW_COUNT]}
        material={mat("glass")}
        frustumCulled={false}
      />

      <instancedMesh
        ref={lit}
        args={[undefined, undefined, LIT_WINDOWS.length]}
        material={mat("warmLight", { emissive: "#FFC861", emissiveIntensity: 2.2 })}
        frustumCulled={false}
      >
        <boxGeometry args={[WIN.w - 0.06, WIN.h - 0.06, 0.07]} />
      </instancedMesh>
    </group>
  );
}
