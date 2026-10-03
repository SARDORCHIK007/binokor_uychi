import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { mat } from "../Materials";
import { roundedBox } from "../RBox";
import { useTradeTime } from "./TradeTime";

export type Rot = [number, number, number];

/** Ishchining holati. Qo'l: elkadan aylanish (x < 0 — oldinga ko'tariladi). */
export interface WorkerPose {
  rightArm?: Rot;
  leftArm?: Rot;
  /** Tirsak bukilishi (radian, 0 — to'g'ri). Berilmasa — tabiiy kichik bukilish */
  rightElbow?: number;
  leftElbow?: number;
  /** Gavda egilishi (sondan) */
  torso?: Rot;
  head?: Rot;
  rightLeg?: Rot;
  leftLeg?: Rot;
  rightKnee?: number;
  leftKnee?: number;
}

interface Props {
  /** Sikl vaqti (sekund) bo'yicha holatni qaytaradi — qo'l harakati shu orqali beriladi */
  pose?: (t: number) => WorkerPose;
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  /** Payvandchi niqobi */
  mask?: boolean;
  /** O'ng / chap qo'lda ushlanadigan asbob */
  rightHand?: ReactNode;
  leftHand?: ReactNode;
  shadows?: boolean;
}

const ZERO: Rot = [0, 0, 0];
const HIP_Y = 0.92;
const SHOULDER: [number, number] = [0.25, 0.58]; // gavda guruhiga nisbatan (x, y)
const ELBOW_DEFAULT = 0.22;

/**
 * Ishchi: kapsula shaklidagi qo'l-oyoqlar (tirsak va tizza bo'g'imlari bilan),
 * yumaloq gavda, signal jilet (aks qaytaruvchi tasmalar bilan), qo'lqop, botinka
 * va soyabonli kaska. Barcha kasb sahnalarida qayta ishlatiladi.
 */
export function Worker({
  pose,
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  mask = false,
  rightHand,
  leftHand,
  shadows = false,
}: Props) {
  const time = useTradeTime();
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const rArm = useRef<Group>(null);
  const lArm = useRef<Group>(null);
  const rElbow = useRef<Group>(null);
  const lElbow = useRef<Group>(null);
  const rLeg = useRef<Group>(null);
  const lLeg = useRef<Group>(null);
  const rKnee = useRef<Group>(null);
  const lKnee = useRef<Group>(null);

  useFrame(() => {
    if (!pose) return;
    const p = pose(time.current);
    torso.current?.rotation.set(...(p.torso ?? ZERO));
    head.current?.rotation.set(...(p.head ?? ZERO));
    rArm.current?.rotation.set(...(p.rightArm ?? ZERO));
    lArm.current?.rotation.set(...(p.leftArm ?? ZERO));
    rElbow.current?.rotation.set(-(p.rightElbow ?? ELBOW_DEFAULT), 0, 0);
    lElbow.current?.rotation.set(-(p.leftElbow ?? ELBOW_DEFAULT), 0, 0);
    rLeg.current?.rotation.set(...(p.rightLeg ?? ZERO));
    lLeg.current?.rotation.set(...(p.leftLeg ?? ZERO));
    rKnee.current?.rotation.set(p.rightKnee ?? 0, 0, 0);
    lKnee.current?.rotation.set(p.leftKnee ?? 0, 0, 0);
  });

  const suit = mat("suit");
  const skin = mat("skin");
  const glove = mat("rubber");
  const vest = mat("amber", { roughness: 0.65 });
  const reflect = mat("#DCE1E6", { roughness: 0.25, metalness: 0.6 });

  const arm = (
    side: 1 | -1,
    armRef: typeof rArm,
    elbowRef: typeof rElbow,
    tool?: ReactNode,
  ) => (
    <group ref={armRef} position={[side * SHOULDER[0], SHOULDER[1], 0]}>
      <mesh castShadow={shadows} material={suit}>
        <sphereGeometry args={[0.075, 14, 10]} />
      </mesh>
      <mesh position-y={-0.15} castShadow={shadows} material={suit}>
        <capsuleGeometry args={[0.058, 0.2, 6, 12]} />
      </mesh>
      <group ref={elbowRef} position-y={-0.3} rotation-x={-ELBOW_DEFAULT}>
        <mesh position-y={-0.14} castShadow={shadows} material={suit}>
          <capsuleGeometry args={[0.052, 0.19, 6, 12]} />
        </mesh>
        {/* Qo'lqop */}
        <mesh position-y={-0.3} scale={[1, 1.15, 0.8]} castShadow={shadows} material={glove}>
          <sphereGeometry args={[0.06, 12, 10]} />
        </mesh>
        <group position-y={-0.33}>{tool}</group>
      </group>
    </group>
  );

  const leg = (side: 1 | -1, legRef: typeof rLeg, kneeRef: typeof rKnee) => (
    <group ref={legRef} position={[side * 0.11, HIP_Y, 0]}>
      <mesh position-y={-0.22} castShadow={shadows} material={suit}>
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      <group ref={kneeRef} position-y={-0.44}>
        <mesh position-y={-0.2} castShadow={shadows} material={suit}>
          <capsuleGeometry args={[0.075, 0.3, 6, 12]} />
        </mesh>
        {/* Botinka */}
        <mesh position={[0, -0.39, 0.04]} castShadow={shadows} geometry={roundedBox(0.15, 0.11, 0.27, 0.045)} material={mat("rubber")} />
      </group>
    </group>
  );

  return (
    <group position={position} rotation-y={rotationY} scale={scale}>
      {leg(1, rLeg, rKnee)}
      {leg(-1, lLeg, lKnee)}

      {/* Gavda: sondan egiladi */}
      <group ref={torso} position-y={HIP_Y}>
        <mesh position-y={0.04} castShadow={shadows} geometry={roundedBox(0.36, 0.18, 0.22, 0.07)} material={suit} />
        <mesh position-y={0.12} geometry={roundedBox(0.375, 0.05, 0.235, 0.02)} material={mat("rubber")} />
        <mesh position-y={0.38} castShadow={shadows} geometry={roundedBox(0.42, 0.5, 0.24, 0.1)} material={suit} />

        {/* Signal jilet va aks qaytaruvchi tasmalar */}
        <mesh position-y={0.36} castShadow={shadows} geometry={roundedBox(0.445, 0.4, 0.265, 0.1)} material={vest} />
        <mesh position-y={0.27} geometry={roundedBox(0.452, 0.035, 0.272, 0.015)} material={reflect} />
        <mesh position-y={0.43} geometry={roundedBox(0.452, 0.035, 0.272, 0.015)} material={reflect} />

        {arm(1, rArm, rElbow, rightHand)}
        {arm(-1, lArm, lElbow, leftHand)}

        {/* Bo'yin */}
        <mesh position-y={0.67} material={skin}>
          <cylinderGeometry args={[0.055, 0.06, 0.1, 12]} />
        </mesh>

        {/* Bosh, ko'z, quloq, kaska */}
        <group ref={head} position-y={0.81}>
          <mesh scale={[1, 1.12, 1.02]} castShadow={shadows} material={skin}>
            <sphereGeometry args={[0.125, 24, 18]} />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh position={[s * 0.043, 0.005, 0.113]} material={mat("navy")}>
                <sphereGeometry args={[0.014, 16, 12]} />
              </mesh>
              <mesh position={[s * 0.125, -0.005, 0]} scale={[0.5, 1, 0.8]} material={skin}>
                <sphereGeometry args={[0.03, 16, 12]} />
              </mesh>
            </group>
          ))}
          <mesh position-y={0.035} castShadow={shadows} material={mat("amber")}>
            <sphereGeometry args={[0.142, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position-y={0.035} material={mat("amber")}>
            <cylinderGeometry args={[0.162, 0.168, 0.018, 24]} />
          </mesh>
          {/* Old soyabon */}
          <mesh position={[0, 0.03, 0.14]} scale={[1, 0.18, 0.55]} material={mat("amber")}>
            <sphereGeometry args={[0.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position-y={0.17} geometry={roundedBox(0.04, 0.03, 0.24, 0.012)} material={mat("amber")} />

          {mask && (
            <group position={[0, -0.01, 0.13]}>
              <mesh geometry={roundedBox(0.27, 0.27, 0.05, 0.03)} material={mat("steel", { metalness: 0.2, roughness: 0.6 })} />
              <mesh position={[0, 0.035, 0.027]} geometry={roundedBox(0.16, 0.06, 0.01, 0.004)} material={mat("glass")} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
