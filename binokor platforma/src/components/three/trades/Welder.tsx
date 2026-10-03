import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MeshStandardMaterial,
  PointsMaterial,
  type Group,
  type Mesh,
  type PointLight,
} from "three";
import { mat, COLORS } from "../Materials";
import { RBoxGeo } from "../RBox";
import { lerp, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const WELD = [0.6, 3.6] as const;
const SEAM = { from: -0.8, to: 0.8, y: 0.135, z: 0.075 };
const SEGMENTS = 20;
const SPARKS = 45;
const COOL_TIME = 1.6;

const HOT = new Color("#FF8A1F");
const COLD = new Color(COLORS.steel).multiplyScalar(0.8);

const weldX = (t: number) => lerp(SEAM.from, SEAM.to, seg(t, WELD[0], WELD[1]));
const welding = (t: number) => t > WELD[0] && t < WELD[1];

function pose(t: number): WorkerPose {
  const w = seg(t, WELD[0] - 0.4, WELD[0]) * (1 - seg(t, WELD[1], WELD[1] + 0.5));
  return {
    torso: [0.45 * w, 0, 0],
    head: [0.35 * w, 0, 0],
    rightArm: [-0.9 * w, 0, -0.2 * w],
    leftArm: [-0.4 * w, 0, 0.15 * w],
  };
}

function Torch() {
  return (
    <group rotation-x={-1.1}>
      <mesh position-y={-0.08} material={mat("navy")}>
        <cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />
      </mesh>
      <mesh position-y={-0.2} material={mat("steel", { metalness: 0.6, roughness: 0.3 })}>
        <cylinderGeometry args={[0.012, 0.02, 0.1, 16]} />
      </mesh>
    </group>
  );
}

export default function Welder({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const workerGroup = useRef<Group>(null);
  const arc = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const beads = useRef<(Mesh | null)[]>([]);

  // Har chok bo'lagi o'z rangida soviydi — alohida material
  const beadMats = useMemo(
    () =>
      Array.from(
        { length: SEGMENTS },
        () => new MeshStandardMaterial({ color: COLD.clone(), flatShading: false, roughness: 0.6 }),
      ),
    [],
  );

  // Uchqunlar: pozitsiya, tezlik, umr
  const sparks = useMemo(() => {
    const pos = new Float32Array(SPARKS * 3).fill(-10);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    return {
      geo,
      pos,
      vel: new Float32Array(SPARKS * 3),
      life: new Float32Array(SPARKS),
      material: new PointsMaterial({ color: "#FFE7A3", size: 0.05, sizeAttenuation: true }),
    };
  }, []);

  useFrame((_, rawDt) => {
    const t = time.current;
    const dt = Math.min(rawDt, 0.05);
    const x = weldX(t);
    const on = welding(t);

    // Ishchi nuqtaning chap-orqasidan yuradi (kamera chokni ko'radi)
    if (workerGroup.current) workerGroup.current.position.x = x - 0.7;

    // Yorug' nuqta va miltillovchi yorug'lik
    if (arc.current) {
      arc.current.visible = on;
      arc.current.position.set(x, SEAM.y + 0.02, SEAM.z + 0.02);
    }
    if (light.current) {
      light.current.intensity = on ? 2.5 + Math.random() * 2 : 0;
      light.current.position.set(x, SEAM.y + 0.25, SEAM.z + 0.3);
    }

    // Chok: nuqta o'tgan joyda paydo bo'ladi, to'q sariqdan kulrangga soviydi
    beads.current.forEach((m, i) => {
      if (!m) return;
      const sx = lerp(SEAM.from, SEAM.to, (i + 0.5) / SEGMENTS);
      const passedAt = lerp(WELD[0], WELD[1], (i + 0.5) / SEGMENTS);
      m.visible = t >= passedAt;
      m.position.x = sx;
      const heat = 1 - seg(t - passedAt, 0, COOL_TIME);
      const mtl = beadMats[i];
      mtl.color.copy(COLD).lerp(HOT, heat);
      mtl.emissive.copy(HOT).multiplyScalar(heat * 1.4);
    });

    // Uchqunlar: gravitatsiya bilan sachraydi
    const { pos, vel, life } = sparks;
    for (let i = 0; i < SPARKS; i++) {
      const k = i * 3;
      life[i] -= dt;
      if (life[i] <= 0) {
        if (on && Math.random() < 0.5) {
          pos[k] = x;
          pos[k + 1] = SEAM.y + 0.02;
          pos[k + 2] = SEAM.z + 0.02;
          vel[k] = (Math.random() - 0.5) * 1.6;
          vel[k + 1] = 0.6 + Math.random() * 1.6;
          vel[k + 2] = 0.2 + Math.random() * 1.2;
          life[i] = 0.35 + Math.random() * 0.4;
        } else {
          pos[k + 1] = -10;
        }
        continue;
      }
      vel[k + 1] -= 9.8 * dt;
      pos[k] += vel[k] * dt;
      pos[k + 1] += vel[k + 1] * dt;
      pos[k + 2] += vel[k + 2] * dt;
      if (pos[k + 1] < 0.02) {
        pos[k + 1] = 0.02;
        vel[k + 1] *= -0.3;
        vel[k] *= 0.5;
        vel[k + 2] *= 0.5;
      }
    }
    (sparks.geo.attributes.position as BufferAttribute).needsUpdate = true;
  });

  const steel = mat("steel", { metalness: 0.45, roughness: 0.5 });

  return (
    <group>
      {/* T shaklidagi ikki to'sin */}
      <mesh position={[0, 0.05, 0]} castShadow={shadows} receiveShadow={shadows} material={steel}>
        <RBoxGeo args={[1.9, 0.1, 0.9]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow={shadows} receiveShadow={shadows} material={steel}>
        <RBoxGeo args={[1.9, 0.8, 0.1]} />
      </mesh>

      {/* Chok bo'laklari */}
      {beadMats.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => (beads.current[i] = el)}
          position={[0, SEAM.y, SEAM.z]}
          rotation-z={Math.PI / 2}
          visible={false}
          material={m}
        >
          <cylinderGeometry args={[0.03, 0.03, (SEAM.to - SEAM.from) / SEGMENTS + 0.01, 16]} />
        </mesh>
      ))}

      {/* Yoy nuqtasi */}
      <mesh ref={arc} visible={false} material={mat("white", { emissive: "#FFF4D6", emissiveIntensity: 3 })}>
        <sphereGeometry args={[0.035, 16, 12]} />
      </mesh>
      <pointLight ref={light} color="#FFB45A" intensity={0} distance={2.5} decay={2} />

      <points geometry={sparks.geo} material={sparks.material} frustumCulled={false} />

      <group ref={workerGroup} position={[SEAM.from - 0.7, 0, 0.7]}>
        <Worker rotationY={2.2} pose={pose} mask rightHand={<Torch />} shadows={shadows} />
      </group>
    </group>
  );
}
