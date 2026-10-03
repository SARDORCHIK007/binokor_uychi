import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { SceneCanvas } from "../SceneCanvas";
import { useScrollProgress } from "../../../hooks/useScrollProgress";
import { Building } from "./Building";
import { Crane } from "./Crane";
import { Ground } from "./Ground";
import { Trees } from "./Trees";
import { T, easeInOut, lerp, seg } from "./timeline";

const BASE_ANGLE = Math.PI / 4; // kamera [28, 22, 28]
const RADIUS = Math.hypot(28, 28);
const TARGET_Y = 8;
const PARALLAX = (2 * Math.PI) / 180; // ±2°

/**
 * Kamera: izometrik burchakdan scroll bilan sekin pastga va o'ngga suriladi,
 * yakunda binoni yarim aylanib chiqadi. Desktopda sichqoncha bilan ±2° og'adi.
 */
function CameraRig({
  progress,
  parallax,
  offsetRight,
}: {
  progress: MutableRefObject<number>;
  parallax: boolean;
  offsetRight: boolean;
}) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallax]);

  // Desktopda bino o'ng tomonda, chapda matn uchun joy qoladi
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    if (offsetRight) cam.setViewOffset(size.width, size.height, -size.width * 0.2, 0, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }, [camera, size, offsetRight]);

  useFrame(() => {
    const p = progress.current;
    const ptr = pointer.current;
    ptr.x += (ptr.tx - ptr.x) * 0.05;
    ptr.y += (ptr.ty - ptr.y) * 0.05;

    const drift = seg(p, 0, T.final[0]);
    const orbit = easeInOut(seg(p, T.final[0], T.final[1]));
    const angle = BASE_ANGLE - 0.18 * drift - Math.PI * orbit + ptr.x * PARALLAX;
    const y = lerp(22, 17, drift) - ptr.y * RADIUS * Math.tan(PARALLAX);

    camera.position.set(RADIUS * Math.cos(angle), y, RADIUS * Math.sin(angle));
    camera.lookAt(0, TARGET_Y, 0);
  });

  return null;
}

/** Intro tugaydigan nuqta: poydevor tayyor, kran o'rnatilgan */
const INTRO_END = 0.205;
const INTRO_SECONDS = 3;

/**
 * Sahifa ochilganda scroll'siz qisqa intro: poydevor konturi, poydevor va kran
 * (p: 0 → INTRO_END). Keyin scroll qavatlarni qurishni shu nuqtadan davom ettiradi:
 * p = INTRO_END + scroll × (1 − INTRO_END).
 */
function IntroDriver({
  scroll,
  out,
  reduced,
}: {
  scroll: MutableRefObject<number>;
  out: MutableRefObject<number>;
  reduced: boolean;
}) {
  const start = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (reduced) {
      out.current = 1;
      return;
    }
    if (start.current === null) start.current = clock.elapsedTime;
    const intro = easeInOut(Math.min(1, (clock.elapsedTime - start.current) / INTRO_SECONDS));
    out.current = Math.max(intro * INTRO_END, INTRO_END + scroll.current * (1 - INTRO_END));
  });
  return null;
}

interface Props {
  triggerRef: RefObject<HTMLElement>;
  reduced: boolean;
  active: boolean;
  mobile: boolean;
}

export default function HeroScene({ triggerRef, reduced, active, mobile }: Props) {
  const scroll = useScrollProgress(triggerRef, reduced);
  // Sahna o'qiydigan yakuniy progress (intro + scroll)
  const progress = useRef(reduced ? 1 : 0);
  const shadows = !mobile;

  return (
    <SceneCanvas
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      shadows={shadows}
      mood="night"
      devName="hero"
      camera={{ fov: mobile ? 44 : 50, position: [28, 22, 28], near: 0.5, far: 200 }}
    >
      {/* Uzoqdagi yer osmon rangiga singib ketadi — ufq chizig'i */}
      <fog attach="fog" args={["#0C1A33", 45, 115]} />
      <IntroDriver scroll={scroll} out={progress} reduced={reduced} />
      <CameraRig progress={progress} parallax={!mobile && !reduced} offsetRight={!mobile} />
      <Ground progress={progress} />
      <Building progress={progress} shadows={shadows} />
      <Crane progress={progress} shadows={shadows} />
      <Trees progress={progress} shadows={shadows} segments={mobile ? 5 : 7} />
    </SceneCanvas>
  );
}
