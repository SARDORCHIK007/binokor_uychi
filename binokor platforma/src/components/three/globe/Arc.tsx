import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  type Mesh,
  type Vector3,
} from "three";
import { COLORS } from "../Materials";
import { easeOut, seg } from "../anim";
import { GLOBE_R } from "./geo";

const SEGMENTS = 64;
const RADIAL = 5;

interface Props {
  from: Vector3;
  to: Vector3;
  /** Yoy chizilishi: umumiy scroll progress shu oraliqda 0 → 1 */
  range: [number, number];
  progress: MutableRefObject<number>;
  highlighted: boolean;
  /** Yuguruvchi nuqtaning fazasi (yoylar bir vaqtda yugurmasligi uchun) */
  phase: number;
}

/**
 * Uychi'dan davlatga yoy (QuadraticBezier). Balandligi masofaga proporsional.
 * Scroll bilan chiziladi, keyin yoy bo'ylab yorug' nuqta yuguradi.
 */
export function Arc({ from, to, range, progress, highlighted, phase }: Props) {
  const { curve, geometry } = useMemo(() => {
    const dist = from.distanceTo(to);
    const control = from.clone().add(to).normalize().multiplyScalar(GLOBE_R + dist * 0.42);
    const c = new QuadraticBezierCurve3(from, control, to);
    return { curve: c, geometry: new TubeGeometry(c, SEGMENTS, 0.009, RADIAL, false) };
  }, [from, to]);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(COLORS.amber),
        emissive: new Color(COLORS.amber),
        emissiveIntensity: 0.5,
        flatShading: false,
      }),
    [],
  );
  const runner = useRef<Mesh>(null);
  const endDot = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const s = easeOut(seg(progress.current, range[0], range[1]));
    const verts = Math.floor(s * SEGMENTS) * RADIAL * 6;
    geometry.setDrawRange(0, verts);

    const target = highlighted ? 1.6 : 0.5;
    material.emissiveIntensity += (target - material.emissiveIntensity) * 0.15;

    if (endDot.current) {
      endDot.current.visible = s > 0.98;
    }
    if (runner.current) {
      runner.current.visible = s >= 1;
      if (s >= 1) {
        const t = (clock.elapsedTime * 0.35 + phase) % 1;
        runner.current.position.copy(curve.getPoint(t));
      }
    }
  });

  return (
    <group>
      <mesh geometry={geometry} material={material} />
      <mesh ref={runner} visible={false}>
        <sphereGeometry args={[0.03, 16, 12]} />
        <meshStandardMaterial color="#FFF4D6" emissive="#FFE2A0" emissiveIntensity={2} />
      </mesh>
      <mesh ref={endDot} position={to} visible={false} material={material}>
        <sphereGeometry args={[0.04, 16, 12]} />
      </mesh>
    </group>
  );
}
