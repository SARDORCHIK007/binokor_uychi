import { useLayoutEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshBasicMaterial, Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { SceneCanvas } from "../SceneCanvas";
import { mat, COLORS } from "../Materials";
import { useScrollProgress } from "../../../hooks/useScrollProgress";
import { Arc } from "./Arc";
import { DESTINATIONS, GLOBE_R, UYCHI, landPoints, latLonToVec } from "./geo";

const DEG = Math.PI / 180;
const DEFAULT_TILT = 0.42;
const AUTO_SPEED = 0.07; // rad/s
const ARC_START = 0.05;
const ARC_STEP = 0.15;
const ARC_LEN = 0.4;

/** Burchakni joriy qiymatga eng yaqin ekvivalentga keltiradi (uzoq aylanmaslik uchun). */
const nearest = (target: number, current: number) =>
  target + Math.PI * 2 * Math.round((current - target) / (Math.PI * 2));

function LandDots({ detail }: { detail: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const points = useMemo(landPoints, []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const d = new Object3D();
    points.forEach((p, i) => {
      d.position.copy(p).multiplyScalar(GLOBE_R + 0.004);
      d.lookAt(p.clone().multiplyScalar(GLOBE_R * 2));
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [points]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]} material={mat("#2C5A8F", { roughness: 0.6 })}>
      <circleGeometry args={[0.022, detail ? 12 : 8]} />
    </instancedMesh>
  );
}

/** Uychi nuqtasi va uning atrofida pulsatsiyalanuvchi halqa. */
function UychiMarker({ reduced }: { reduced: boolean }) {
  const ring = useRef<Mesh>(null);
  const pos = useMemo(() => latLonToVec(UYCHI.lat, UYCHI.lon, GLOBE_R + 0.01), []);
  const ringMat = useMemo(
    () => new MeshBasicMaterial({ color: COLORS.amber, transparent: true, depthWrite: false }),
    [],
  );
  const orient = useMemo(() => {
    const o = new Object3D();
    o.position.copy(pos);
    o.lookAt(pos.clone().multiplyScalar(2));
    return o.quaternion.clone();
  }, [pos]);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = reduced ? 0.3 : (clock.elapsedTime % 1.6) / 1.6;
    ring.current.scale.setScalar(1 + t * 2.2);
    ringMat.opacity = 1 - t;
  });

  return (
    <group position={pos} quaternion={orient}>
      <mesh material={mat("amber", { emissive: COLORS.amber, emissiveIntensity: 0.6 })}>
        <sphereGeometry args={[0.055, 12, 10]} />
      </mesh>
      <mesh ref={ring} material={ringMat}>
        <ringGeometry args={[0.06, 0.085, 28]} />
      </mesh>
    </group>
  );
}

function Globe({
  progress,
  hovered,
  reduced,
  mobile,
}: {
  progress: MutableRefObject<number>;
  hovered: number | null;
  reduced: boolean;
  mobile: boolean;
}) {
  const tiltRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const state = useRef({ spin: -UYCHI.lon * DEG + 0.25, tilt: DEFAULT_TILT });
  const uychi = useMemo(() => latLonToVec(UYCHI.lat, UYCHI.lon, GLOBE_R + 0.01), []);
  const targets = useMemo(() => DESTINATIONS.map((d) => latLonToVec(d.lat, d.lon, GLOBE_R + 0.01)), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    if (hovered !== null) {
      // Kartochka ustida — globus o'sha davlatga buriladi
      const d = DESTINATIONS[hovered];
      const spinTarget = nearest(-d.lon * DEG, s.spin);
      const k = Math.min(1, dt * 3.5);
      s.spin += (spinTarget - s.spin) * k;
      s.tilt += (d.lat * DEG * 0.85 - s.tilt) * k;
    } else {
      if (!reduced) s.spin += dt * AUTO_SPEED;
      s.tilt += (DEFAULT_TILT - s.tilt) * Math.min(1, dt * 2);
    }
    if (spinRef.current) spinRef.current.rotation.y = s.spin;
    if (tiltRef.current) tiltRef.current.rotation.x = s.tilt;
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        {/* Okean: silliq shar, yengil yaltiroq */}
        <mesh material={mat("navy700", { roughness: 0.45, metalness: 0.15 })}>
          <sphereGeometry args={[GLOBE_R, mobile ? 48 : 72, mobile ? 32 : 48]} />
        </mesh>
        <LandDots detail={!mobile} />
        <UychiMarker reduced={reduced} />
        {targets.map((to, i) => (
          <Arc
            key={i}
            from={uychi}
            to={to}
            range={[ARC_START + i * ARC_STEP, ARC_START + i * ARC_STEP + ARC_LEN]}
            progress={progress}
            highlighted={hovered === i}
            phase={i * 0.21}
          />
        ))}
      </group>
    </group>
  );
}

interface Props {
  triggerRef: RefObject<HTMLElement>;
  hovered: number | null;
  reduced: boolean;
  active: boolean;
  mobile: boolean;
  label: string;
}

export default function GlobeScene({ triggerRef, hovered, reduced, active, mobile, label }: Props) {
  // Yoylar globus ekranga kirgandan to'liq ko'ringunicha chiziladi
  const progress = useScrollProgress(triggerRef, reduced, { start: "top 85%", end: "bottom 75%" });

  return (
    <SceneCanvas
      frameloop={active ? "always" : "never"}
      shadows={false}
      camera={{ fov: 35, position: [0, 0, 7], near: 0.1, far: 50 }}
      ariaLabel={label}
      devName="globe"
    >
      <Globe progress={progress} hovered={hovered} reduced={reduced} mobile={mobile} />
    </SceneCanvas>
  );
}
