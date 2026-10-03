import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Globe2, Rotate3d } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { useIsMobile } from "../hooks/useIsMobile";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLSupport } from "../hooks/useWebGLSupport";
import type { Trade } from "./Trades";

const TradeModalStage = lazy(() => import("../components/three/trades/TradeModalStage"));

interface Props {
  trade: Trade | null;
  index: number;
  onClose: () => void;
}

export function TradeModal({ trade, index, onClose }: Props) {
  const { t } = useTranslation();
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const titleId = "trade-modal-title";

  return (
    <Modal open={trade !== null} onClose={onClose} labelledBy={titleId} closeLabel={t("trades.labels.close")}>
      {trade && (
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <div className="relative h-[300px] border-b border-line bg-[radial-gradient(ellipse_at_50%_35%,#1B2B45_0%,#0A1220_75%)] md:h-auto md:min-h-[480px] md:border-b-0 md:border-r">
            {webgl ? (
              <Suspense fallback={null}>
                <TradeModalStage index={index} reduced={reduced} mobile={mobile} label={trade.name} />
              </Suspense>
            ) : (
              <img
                src={`/fallback/trade-${index + 1}.webp`}
                alt={trade.name}
                className="h-full w-full object-cover"
              />
            )}
            {webgl && (
              <p className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-line-strong bg-ink px-3 py-1 text-xs font-medium text-muted">
                <Rotate3d className="h-4 w-4" aria-hidden="true" />
                {t("trades.labels.rotate")}
              </p>
            )}
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <p className="mb-2 font-heading text-sm font-bold">
              <span className="rounded-md bg-amber px-2 py-0.5 text-ink">{String(index + 1).padStart(2, "0")}</span>
            </p>
            <h3 id={titleId} className="mb-4 pr-10 text-h2 text-white lg:text-[34px]">
              {trade.name}
            </h3>
            <p className="mb-7 text-muted">{trade.description}</p>

            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber">
              {t("trades.labels.skills")}
            </h4>
            <ul className="mb-6 grid gap-2">
              {trade.skills.map((s) => (
                <li key={s} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber">
              {t("trades.labels.countries")}
            </h4>
            <p className="flex items-start gap-2.5 rounded-xl border border-line bg-deep p-4">
              <Globe2 className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
              <span>{trade.countries}</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
