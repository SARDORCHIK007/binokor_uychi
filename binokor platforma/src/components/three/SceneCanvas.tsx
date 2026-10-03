import { useEffect, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type Props as CanvasProps } from "@react-three/fiber";
import {
  DataTexture,
  EquirectangularReflectionMapping,
  LinearFilter,
  RGBAFormat,
  SRGBColorSpace,
  type Texture,
} from "three";

/**
 * Atrof-muhit yorug'ligi (IBL) uchun kichik gradient "osmon" teksturasi (64×32):
 * tepada yorug' osmon, ufqda oq yo'l, pastda iliq yer. Fayl yuklanmaydi va
 * barcha sahnalar uchun bitta nusxa — hisoblash juda arzon.
 */
let skyTexture: Texture | null = null;
function getSkyTexture(): Texture {
  if (skyTexture) return skyTexture;
  const W = 64;
  const H = 32;
  const data = new Uint8Array(W * H * 4);
  const top = [178, 200, 235];
  const horizon = [255, 252, 245];
  const bottom = [120, 108, 92];
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1); // 0 — tepa, 1 — past
    const c =
      v < 0.5
        ? top.map((t, i) => t + (horizon[i] - t) * Math.pow(v / 0.5, 2))
        : horizon.map((h, i) => h + (bottom[i] - h) * Math.min(1, (v - 0.5) / 0.15));
    for (let x = 0; x < W; x++) {
      // Quyosh tomonda (yuqori-o'ng) biroz yorqinroq
      const sun = Math.max(0, Math.cos(((x / W) * 2 - 0.35) * Math.PI)) * (v < 0.5 ? 25 : 0);
      const k = (y * W + x) * 4;
      data[k] = Math.min(255, c[0] + sun);
      data[k + 1] = Math.min(255, c[1] + sun);
      data[k + 2] = Math.min(255, c[2] + sun * 0.8);
      data[k + 3] = 255;
    }
  }
  const tex = new DataTexture(data, W, H, RGBAFormat);
  tex.mapping = EquirectangularReflectionMapping;
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.flipY = true;
  tex.needsUpdate = true;
  skyTexture = tex;
  return tex;
}

function StudioEnvironment({ intensity }: { intensity: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.environment = getSkyTexture();
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
    };
  }, [scene, intensity]);
  return null;
}

/**
 * Shaderlarni oldindan, asosiy oqimni bloklamasdan (`compileAsync`, parallel kompilyatsiya)
 * tayyorlaydi. Shu vaqtgacha sahna chizilmaydi — sahifa "qotib" qolmaydi.
 * Yashirin obyektlar ham (keyin paydo bo'ladigan qavatlar, kran) kompilyatsiya qilinadi.
 */
function Warmup({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let alive = true;
    const hidden: { visible: boolean }[] = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    const done = () => {
      hidden.forEach((o) => (o.visible = false));
      if (alive) onReady();
    };
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      alive = false;
    };
    // Faqat mount paytida bir marta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/**
 * "demand" rejimida (reduced-motion) sahna mount bo'lganda va o'lcham o'zgarganda
 * qayta chiziladi — aks holda birinchi kadr canvas tayyor bo'lmasdan chizilib qolishi mumkin.
 */
function DemandInvalidator() {
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  useEffect(() => {
    invalidate();
    const timers = [50, 250, 800].map((ms) => window.setTimeout(() => invalidate(), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [invalidate, size.width, size.height]);
  return null;
}

/** Faqat dev: window.__gl[name] = { gl, scene, camera } — fallback/OG rasmlarni olish uchun. */
function DevExpose({ name }: { name: string }) {
  useFrame(({ gl, scene, camera }) => {
    const w = window as unknown as { __gl?: Record<string, unknown> };
    w.__gl = { ...w.__gl, [name]: { gl, scene, camera } };
  });
  return null;
}

interface Props {
  children: ReactNode;
  frameloop?: CanvasProps["frameloop"];
  shadows?: boolean;
  camera?: CanvasProps["camera"];
  className?: string;
  /** Soya kamerasining yarim kengligi (sahna o'lchamiga qarab) */
  shadowExtent?: number;
  shadowMapSize?: number;
  ariaLabel?: string;
  /** Atrof-muhit yorug'ligi kuchi */
  envIntensity?: number;
  /** Yorug'lik kayfiyati: kunduzgi studiya yoki tungi (oy nuri) */
  mood?: "day" | "night";
  /** Dev rejimida sahnani rasmga olish uchun nom */
  devName?: string;
}

/**
 * Barcha 3D sahnalar uchun umumiy Canvas: DPR [1, 1.5], yumshoq soyalar,
 * osmon/yer yorug'ligi + atrof-muhit aksi + yuqori-o'ngdan quyosh,
 * shaffof fon (osmon CSS gradient orqali beriladi).
 */
export function SceneCanvas({
  children,
  frameloop = "always",
  shadows = true,
  camera,
  className,
  shadowExtent = 25,
  shadowMapSize = 1024,
  ariaLabel,
  envIntensity,
  mood = "day",
  devName,
}: Props) {
  const [ready, setReady] = useState(false);
  const night = mood === "night";
  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      frameloop={ready ? frameloop : "never"}
      style={{ opacity: ready ? 1 : 0, transition: "opacity .4s ease" }}
      shadows={shadows}
      camera={camera}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <StudioEnvironment intensity={envIntensity ?? (night ? 0.22 : 0.55)} />
      {/* Osmon (yuqoridan sovuq) va yer (pastdan iliq) aks nuri */}
      <hemisphereLight args={night ? ["#7F97C4", "#141A26", 0.55] : ["#E6EEFF", "#7A6E58", 0.7]} />
      {/* Quyosh: yuqori-o'ngda, soya bilan */}
      <directionalLight
        position={[18, 30, 12]}
        intensity={night ? 1.1 : 2.4}
        color={night ? "#B9CCF2" : "#FFF6E8"}
        castShadow={shadows}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-shadowExtent}
        shadow-camera-right={shadowExtent}
        shadow-camera-top={shadowExtent}
        shadow-camera-bottom={-shadowExtent}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      {frameloop === "demand" && ready && <DemandInvalidator />}
      {import.meta.env.DEV && devName && <DevExpose name={devName} />}
      {children}
      {!ready && <Warmup onReady={() => setReady(true)} />}
    </Canvas>
  );
}
