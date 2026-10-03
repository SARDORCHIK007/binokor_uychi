import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ArrowRight } from "lucide-react";
import { TradeVisual } from "../components/three/trades/TradeVisual";
import { TradeModal } from "./TradeModal";

export interface Trade {
  name: string;
  short: string;
  description: string;
  skills: string[];
  countries: string;
}

export function Trades() {
  const { t } = useTranslation();
  const trades = useList<Trade>("trades.items");
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <Section id="trades" tone="raised">
      <SectionTitle id="trades-title" eyebrow={`04 — ${t("nav.trades")}`} intro={t("trades.intro")}>
        {t("trades.title")}
      </SectionTitle>
      {/* Mobil: gorizontal surilma (snap); planshet 2 ustun; desktop 4 ustun */}
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {trades.map((trade, i) => (
          <m.li
            key={trade.name}
            className="w-[78%] shrink-0 snap-start md:w-auto"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
          >
            <TradeCard trade={trade} index={i} paused={selected !== null} onOpen={() => setSelected(i)} />
          </m.li>
        ))}
      </ul>
      <TradeModal trade={selected === null ? null : trades[selected]} index={selected ?? 0} onClose={close} />
    </Section>
  );
}

function TradeCard({
  trade,
  index,
  paused,
  onOpen,
}: {
  trade: Trade;
  index: number;
  paused: boolean;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="card-dark card-dark-hover group flex h-full w-full flex-col overflow-hidden text-left"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <TradeVisual index={index} hovered={hovered} paused={paused} label={trade.name} />
      <span className="flex flex-1 flex-col p-5">
        <span className="mb-2 font-heading text-h3 text-white">{trade.name}</span>
        <span className="text-[15px] text-muted">{trade.short}</span>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-amber">
          {t("trades.labels.open")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
