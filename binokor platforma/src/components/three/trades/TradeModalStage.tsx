import { OrbitControls } from "@react-three/drei";
import TradeStage from "./TradeStage";

interface Props {
  index: number;
  reduced: boolean;
  mobile: boolean;
  label: string;
}

/** Modal oynadagi katta sahna: sichqoncha / barmoq bilan aylantirish mumkin. */
export default function TradeModalStage({ index, reduced, mobile, label }: Props) {
  return (
    <TradeStage
      index={index}
      playing
      reduced={reduced}
      mobile={mobile}
      ariaLabel={label}
      controls={
        <OrbitControls
          makeDefault
          target={[0, 0.95, 0]}
          enablePan={false}
          minDistance={4}
          maxDistance={11}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2 - 0.08}
        />
      }
    />
  );
}
