import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Path,
  Shape,
  type BufferGeometry,
  type Group,
} from "three";
import { mat, COLORS } from "../Materials";
import { RBoxGeo } from "../RBox";
import { easeOut, pulse, seg } from "../anim";
import { useTradeTime } from "./TradeTime";
import { Worker, type WorkerPose } from "./Worker";
import type { TradeSceneProps } from "./TradeStage";

const PANEL = { w: 2, h: 2, d: 0.12, y: 1.17 };
const DEPTH = 0.05;
const GLOW = [3.85, 4.7] as const;

/** 8 qirrali yulduz (girih) konturi. */
function starPoints(R: number, r: number, cx = 0, cy = 0): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 + Math.PI / 8;
    const rad = i % 2 === 0 ? R : r;
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  return pts;
}

function polyShape(pts: [number, number][]): Shape {
  const s = new Shape();
  pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

function polyHole(pts: [number, number][]): Path {
  const p = new Path();
  pts.forEach(([x, y], i) => (i === 0 ? p.moveTo(x, y) : p.lineTo(x, y)));
  p.closePath();
  return p;
}

function extrude(shape: Shape): BufferGeometry {
  return new ExtrudeGeometry(shape, {
    depth: DEPTH,
    curveSegments: 1,
    // Yumshoq qiya qirra — qo'lda o'yilgan ganch kabi
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
}

/** Yulduz halqa: tashqi yulduz, ichida teshik. */
function starRing(R: number, r: number, w: number, cx = 0, cy = 0) {
  const s = polyShape(starPoints(R, r, cx, cy));
  s.holes.push(polyHole(starPoints(R - w, r - w * 0.8, cx, cy)));
  return extrude(s);
}

function rectFrame(size: number, w: number) {
  const h = size / 2;
  const s = polyShape([[-h, -h], [h, -h], [h, h], [-h, h]]);
  const i = h - w;
  s.holes.push(polyHole([[-i, -i], [i, -i], [i, i], [-i, i]]));
  return extrude(s);
}

function bar(x1: number, y1: number, x2: number, y2: number, w: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  return extrude(polyShape([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]));
}

interface Piece {
  geo: BufferGeometry;
  at: number;
  dur: number;
}

function buildPattern(): Piece[] {
  const pieces: Piece[] = [];
  pieces.push({ geo: rectFrame(1.84, 0.07), at: 0.3, dur: 0.6 });
  pieces.push({ geo: starRing(0.52, 0.4, 0.07), at: 0.9, dur: 0.6 });
  pieces.push({ geo: extrude(polyShape(starPoints(0.17, 0.11))), at: 1.5, dur: 0.4 });
  const c = 0.6;
  [[-c, c], [c, c], [c, -c], [-c, -c]].forEach(([x, y], k) => {
    pieces.push({ geo: starRing(0.21, 0.15, 0.05, x, y), at: 1.95 + k * 0.25, dur: 0.35 });
  });
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    const diag = k % 2 === 1;
    const from = 0.5;
    const to = diag ? Math.hypot(c, c) - 0.2 : 0.85;
    pieces.push({
      geo: bar(Math.cos(a) * from, Math.sin(a) * from, Math.cos(a) * to, Math.sin(a) * to, 0.045),
      at: 3.0 + k * 0.07,
      dur: 0.3,
    });
  }
  return pieces;
}

function pose(t: number): WorkerPose {
  const carve = seg(t, 0.15, 0.35) * (1 - seg(t, 3.6, 3.9));
  const tap = Math.sin(t * 14) * 0.08 * carve;
  return {
    rightArm: [-1.45 * carve + tap, 0, -0.35 * carve],
    leftArm: [-1.3 * carve, 0, 0.2 * carve],
    head: [-0.1 * carve, 0, 0],
  };
}

function Chisel() {
  return (
    <group rotation-x={-1.35}>
      <mesh position-y={-0.05} material={mat("wood")}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
      </mesh>
      <mesh position-y={-0.14} material={mat("steel", { metalness: 0.6 })}>
        <RBoxGeo args={[0.03, 0.09, 0.008]} />
      </mesh>
    </group>
  );
}

export default function Ganch({ shadows }: TradeSceneProps) {
  const time = useTradeTime();
  const pieces = useMemo(buildPattern, []);
  const refs = useRef<(Group | null)[]>([]);
  const ribMat = useMemo(
    () => new MeshStandardMaterial({ color: "#F8F5EE", flatShading: false, roughness: 0.9, emissive: new Color(COLORS.amber), emissiveIntensity: 0 }),
    [],
  );
  const glowBase = useMemo(() => new Color("#F8F5EE"), []);
  const glowTint = useMemo(() => new Color(COLORS.amber), []);

  useFrame(() => {
    const t = time.current;
    // Naqsh chiziqlari asta-sekin "o'yilib" chiqadi (chuqurlik bo'yicha)
    refs.current.forEach((g, i) => {
      if (!g) return;
      const p = pieces[i];
      const s = easeOut(seg(t, p.at, p.at + p.dur));
      g.visible = s > 0;
      g.scale.z = Math.max(s, 0.001);
    });
    // Oxirida naqsh amber rangda bir marta porlaydi
    const glow = pulse(seg(t, GLOW[0], GLOW[1]));
    ribMat.emissiveIntensity = glow * 0.9;
    ribMat.color.copy(glowBase).lerp(glowTint, glow * 0.6);
  });

  return (
    <group rotation-y={0.55} position-x={-0.15}>
      {/* Yon tomondan yumshoq yorug'lik — bo'rtma naqsh ko'rinadi */}
      <directionalLight position={[-3, 1.6, 2.2]} intensity={1.6} />

      {/* Molbert va panel */}
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.55, -0.12]} rotation-x={-0.08} castShadow={shadows} material={mat("wood")}>
          <RBoxGeo args={[0.08, 1.1, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, PANEL.y, 0]} castShadow={shadows} receiveShadow={shadows} material={mat("#D9CDB8")}>
        <RBoxGeo args={[PANEL.w, PANEL.h, PANEL.d]} />
      </mesh>

      <group position={[0, PANEL.y, PANEL.d / 2]}>
        {pieces.map((p, i) => (
          <group key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
            <mesh geometry={p.geo} material={ribMat} castShadow={shadows} />
          </group>
        ))}
      </group>

      <Worker position={[1.3, 0, 0.75]} rotationY={-Math.PI / 2 - 0.75} pose={pose} rightHand={<Chisel />} shadows={shadows} />
    </group>
  );
}
