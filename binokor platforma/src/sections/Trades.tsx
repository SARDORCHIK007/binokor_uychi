import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrickWall,
  CheckCircle2,
  ChevronRight,
  Construction,
  Droplets,
  Flame,
  Gem,
  Globe2,
  Grid3x3,
  Hammer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

export interface Trade {
  name: string;
  short: string;
  description: string;
  skills: string[];
  countries: string;
}

/** Tartib `trades.items` bilan bir xil */
const ICONS: LucideIcon[] = [BrickWall, Construction, Flame, Zap, Droplets, Grid3x3, Hammer, Gem];

/** Kasb suratlari (`public/trades/`, Unsplash litsenziyasi — CREDITS.md). Tartib `trades.items` bilan bir xil. */
const PHOTOS = [
  "/trades/bricklayer.webp",
  "/trades/concrete.webp",
  "/trades/welder.webp",
  "/trades/electrician.webp",
  "/trades/plumber.webp",
  "/trades/tiler.webp",
  "/trades/carpenter.webp",
  "/trades/ganch.webp",
];

export function Trades() {
  const { t } = useTranslation();
  const trades = useList<Trade>("trades.items");
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const trade = selected === null ? null : trades[selected];
  const SelectedIcon = selected === null ? null : ICONS[selected];

  return (
    <Section id="trades" tone="white">
      <SectionTitle id="trades-title" intro={t("trades.intro")}>
        {t("trades.title")}
      </SectionTitle>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trades.map((tr, i) => {
          const Icon = ICONS[i] ?? Hammer;
          return (
            <li key={tr.name}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-haspopup="dialog"
                className="group relative isolate flex h-[300px] w-full flex-col justify-end overflow-hidden rounded-card bg-brand-700 p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"
              >
                {PHOTOS[i] && (
                  <img
                    src={PHOTOS[i]}
                    width={800}
                    height={500}
                    loading="lazy"
                    alt=""
                    className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061F36]/95 via-[#061F36]/45 via-45% to-transparent"
                />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand shadow-card">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mb-1.5 font-heading text-[18px] font-bold text-white">{tr.name}</span>
                <span className="text-[14px] leading-snug text-white/85">{tr.short}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-[#F5C76B] group-hover:underline">
                  {t("trades.labels.open")}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Modal open={trade !== null} onClose={close} labelledBy="trade-modal-title" closeLabel={t("trades.labels.close")}>
        {trade && SelectedIcon && (
          <>
            {selected !== null && PHOTOS[selected] && (
              <img
                src={PHOTOS[selected]}
                width={800}
                height={500}
                alt=""
                className="aspect-[16/7] w-full rounded-t-card object-cover"
              />
            )}
            <div className="p-6 md:p-8">
              <div className="mb-5 flex items-center gap-4 pr-10">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <SelectedIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 id="trade-modal-title" className="text-[22px]">
                  {trade.name}
                </h3>
              </div>
              <p className="mb-6 text-muted">{trade.description}</p>

              <h4 className="kicker">{t("trades.labels.skills")}</h4>
              <ul className="mb-6 grid gap-2 md:grid-cols-2">
                {trade.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[15px]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>

              <h4 className="kicker">{t("trades.labels.countries")}</h4>
              <p className="flex items-start gap-2 rounded-lg bg-soft p-4 text-[15px]">
                <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {trade.countries}
              </p>
            </div>
          </>
        )}
      </Modal>
    </Section>
  );
}
