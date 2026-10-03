import { lazy, Suspense, useRef, type ComponentType, type MutableRefObject, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { SceneCanvas } from "../SceneCanvas";
import { mat } from "../Materials";
import { CYCLE, TradeTimeContext } from "./TradeTime";

export interface TradeSceneProps {
  shadows: boolean;
}

/** Kasb sahnalari: tartib `trades.items` bilan bir xil. */
const SCENES: (ComponentType<TradeSceneProps> | null)[] = [
  lazy(() => import("./Bricklayer")),
  lazy(() => import("./Concrete")),
  lazy(() => import("./Welder")),
  lazy(() => import("./Electrician")),
  lazy(() => import("./Plumber")),
  lazy(() => import("./Tiler")),
  lazy(() => import("./Carpenter")),
  lazy(() => import("./Ganch")),
];

const END_STATE = CYCLE - 0.01;

/** Sikl vaqtini yuritadi. Sahnalardan oldin turadi — vaqt birinchi yangilanadi. */
function TimeDriver({ time, reduced }: { time: MutableRefObject<number>; reduced: boolean }) {
  useFrame((_, dt) => {
    // Faqat dev: window.__tradeFreeze = 2.5 — barcha sahnalarni shu soniyada to'xtatadi
    const freeze = import.meta.env.DEV
      ? (window as unknown as { __tradeFreeze?: number }).__tradeFreeze
      : undefined;
    if (freeze !== undefined) {
      time.current = freeze;
      return;
    }
    if (reduced) {
      time.current = END_STATE;
      return;
    }
    time.current = (time.current + Math.min(dt, 0.1)) % CYCLE;
  });
  return null;
}

/** Hover'da kamera biroz yaqinlashadi. */
function CameraRig({ hovered, target }: { hovered: boolean; target: [number, number, number] }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useFrame(() => {
    const z = hovered ? 1.14 : 1;
    if (Math.abs(camera.zoom - z) > 0.001) {
      camera.zoom += (z - camera.zoom) * 0.08;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(...target);
  });
  return null;
}

function TimeProvider({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const time = useRef(reduced ? END_STATE : 0);
  return (
    <TradeTimeContext.Provider value={time}>
      <TimeDriver time={time} reduced={reduced} />
      {children}
    </TradeTimeContext.Provider>
  );
}

interface Props {
  index: number;
  hovered?: boolean;
  /** Ekranda ko'rinyaptimi — ko'rinmasa sahna to'xtatiladi */
  playing: boolean;
  reduced: boolean;
  mobile: boolean;
  /** Modal oynadagi katta sahna uchun qo'shimcha boshqaruv (OrbitControls) */
  controls?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function TradeStage({
  index,
  hovered = false,
  playing,
  reduced,
  mobile,
  controls,
  className,
  ariaLabel,
}: Props) {
  const Scene = SCENES[index];
  const shadows = !mobile;
  if (!Scene) return null;

  return (
    <SceneCanvas
      className={className}
      ariaLabel={ariaLabel}
      devName={controls ? `trade-modal-${index + 1}` : `trade-${index + 1}`}
      frameloop={reduced ? "demand" : playing ? "always" : "never"}
      shadows={shadows}
      shadowExtent={4}
      shadowMapSize={512}
      camera={{ fov: 32, position: [4.3, 3.0, 5.7], near: 0.1, far: 50 }}
    >
      {controls ?? <CameraRig hovered={hovered} target={[0, 0.95, 0]} />}
      <TimeProvider reduced={reduced}>
        <mesh position-y={-0.06} receiveShadow={shadows} material={mat("base")}>
          <cylinderGeometry args={[2.4, 2.5, 0.12, 72]} />
        </mesh>
        <Suspense fallback={null}>
          <Scene shadows={shadows} />
        </Suspense>
      </TimeProvider>
    </SceneCanvas>
  );
}
