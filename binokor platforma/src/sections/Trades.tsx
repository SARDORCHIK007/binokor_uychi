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

      <ul className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {trades.map((tr, i) => {
          const Icon = ICONS[i] ?? Hammer;
          return (
            <li key={tr.name}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-haspopup="dialog"
                className="card card-link group flex h-full w-full flex-col p-5 text-left"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mb-1.5 font-heading text-[16px] font-bold text-ink">{tr.name}</span>
                <span className="text-[14px] text-muted">{tr.short}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-medium text-brand group-hover:underline">
                  {t("trades.labels.open")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Modal open={trade !== null} onClose={close} labelledBy="trade-modal-title" closeLabel={t("trades.labels.close")}>
        {trade && SelectedIcon && (
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
        )}
      </Modal>
    </Section>
  );
}
