import { lazy, Suspense, useState } from "react";
import { useInView } from "../../../hooks/useInView";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeviceTier } from "../../../hooks/useWebGLSupport";
import { TRADE_SCENES_READY } from "./ready";

const TradeStage = lazy(() => import("./TradeStage"));

interface Props {
  index: number;
  hovered: boolean;
  /** Modal ochiq bo'lsa kartochka sahnalari to'xtaydi */
  paused?: boolean;
  label: string;
}

function Placeholder({ index, label }: { index: number; label: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="font-heading text-[56px] font-extrabold text-white/10" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
    );
  }
  return (
    <img
      src={`/fallback/trade-${index + 1}.webp`}
      alt={label}
      width={440}
      height={330}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

/**
 * Kartochkadagi 3D sahna: ekranga 200px qolganda yuklanadi, ekrandan chiqsa
 * to'xtaydi, uzoqlashsa butunlay o'chiriladi (WebGL kontekstlari tejaladi).
 */
export function TradeVisual({ index, hovered, paused = false, label }: Props) {
  // "lite" qurilmada kartochkalarda statik rasm, jonli sahna faqat modalda
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [nearRef, near] = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const [visRef, visible] = useInView<HTMLDivElement>({ rootMargin: "0px" });
  const ready = tier === "full" && TRADE_SCENES_READY[index];

  return (
    <div ref={nearRef} className="relative h-[220px] border-b border-line bg-[radial-gradient(ellipse_at_50%_35%,#1B2B45_0%,#0D1626_70%)]">
      <div ref={visRef} className="absolute inset-0 flex items-center justify-center">
        {ready ? (
          near && (
            <Suspense fallback={null}>
              <TradeStage
                index={index}
                hovered={hovered}
                playing={visible && !paused}
                reduced={reduced}
                mobile={mobile}
                ariaLabel={label}
              />
            </Suspense>
          )
        ) : (
          <Placeholder index={index} label={label} />
        )}
      </div>
    </div>
  );
}
