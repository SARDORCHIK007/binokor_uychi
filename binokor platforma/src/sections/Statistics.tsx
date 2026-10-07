import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { MASTERS, TRADE_STATS } from "../data/stats";

/** Diagramma ranglari (rang-ko'rlik tekshiruvidan o'tgan juftlik). */
const FORMAL = "#C9922E";
const INFORMAL = "#2563A8";

interface Tile {
  label: string;
  note: string;
}

/** Uychi tumani qurilish ustalari statistikasi: asosiy raqamlar va kasblar bo'yicha diagramma. */
export function Statistics() {
  const { t, i18n } = useTranslation();
  const tiles = useList<Tile>("statistics.tiles");
  const [hover, setHover] = useState<number | null>(null);

  // O'zbekchada: "3 835", "90,5%" (brauzerlarning uz-UZ formati bir xil emas, shuning uchun ru-RU qoidasi)
  const locale = i18n.language === "en" ? "en-US" : "ru-RU";
  const nf = new Intl.NumberFormat(locale);
  const pct = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format((n / MASTERS.total) * 100) + "%";

  const tileValues = [
    { value: nf.format(MASTERS.total), n: MASTERS.mahallas },
    { value: pct(MASTERS.informal), n: nf.format(MASTERS.informal) },
    { value: pct(MASTERS.formal), n: nf.format(MASTERS.formal) },
    { value: nf.format(MASTERS.migration), n: MASTERS.migrationFormal },
  ];

  const max = Math.max(...TRADE_STATS.map((s) => s.formal + s.informal));
  const name = (key: string) => t(`statistics.trades.${key}`);

  return (
    <Section id="statistics" tone="soft">
      <SectionTitle id="statistics-title" kicker={t("statistics.kicker")} intro={t("statistics.intro")}>
        {t("statistics.title")}
      </SectionTitle>

      {/* Asosiy raqamlar */}
      <dl className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <div key={tile.label} className="card flex flex-col p-5 lg:p-6">
            <dt className="order-2 text-[15px] font-medium text-ink">{tile.label}</dt>
            <dd className="order-1 mb-1 font-heading text-[36px] font-extrabold leading-none text-brand lg:text-[42px]">
              {tileValues[i]?.value}
            </dd>
            <dd className="order-3 mt-1 text-[13px] text-muted">{t(`statistics.tiles.${i}.note`, { n: tileValues[i]?.n })}</dd>
          </div>
        ))}
      </dl>

      {/* Kasblar bo'yicha diagramma */}
      <figure className="card p-5 lg:p-8" aria-labelledby="statistics-chart-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 id="statistics-chart-title" className="text-h3">
            {t("statistics.chartTitle")}
          </h3>
          <ul className="flex gap-5 text-[14px] text-muted" aria-hidden="true">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: FORMAL }} />
              {t("statistics.formal")}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: INFORMAL }} />
              {t("statistics.informal")}
            </li>
          </ul>
        </div>

        <ul className="space-y-1" aria-hidden="true">
          {TRADE_STATS.map((s, i) => {
            const total = s.formal + s.informal;
            const active = hover === i;
            return (
              <li
                key={s.key}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`relative grid grid-cols-[120px_1fr] items-center gap-3 rounded-md px-2 py-1.5 md:grid-cols-[190px_1fr] ${
                  active ? "bg-brand-50" : ""
                } ${s.key === "other" ? "mt-2 border-t border-line pt-3" : ""}`}
              >
                <span className="truncate text-[13px] text-ink md:text-[14px]" title={name(s.key)}>
                  {name(s.key)}
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-4 min-w-[10px] gap-[2px]" style={{ width: `${(total / max) * 85}%` }}>
                    {s.formal > 0 && (
                      <span className="h-full rounded-l-[4px]" style={{ width: `${(s.formal / total) * 100}%`, background: FORMAL, minWidth: 2 }} />
                    )}
                    <span
                      className={`h-full min-w-[4px] flex-1 rounded-r-[4px] ${s.formal > 0 ? "" : "rounded-l-[4px]"}`}
                      style={{ background: INFORMAL }}
                    />
                  </span>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">{nf.format(total)}</span>
                </span>

                {active && (
                  <span
                    className={`pointer-events-none absolute right-2 z-10 rounded-md border border-line bg-white px-3 py-2 text-[13px] shadow-card-hover ${
                      i < 2 ? "top-full mt-1" : "-top-2 -translate-y-full"
                    }`}
                  >
                    <span className="mb-1 block font-semibold text-ink">{name(s.key)}</span>
                    <span className="flex items-center gap-2 text-muted">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FORMAL }} />
                      {t("statistics.formal")}: <b className="text-ink">{nf.format(s.formal)}</b>
                    </span>
                    <span className="flex items-center gap-2 text-muted">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: INFORMAL }} />
                      {t("statistics.informal")}: <b className="text-ink">{nf.format(s.informal)}</b>
                    </span>
                    <span className="mt-1 block text-muted">
                      {t("statistics.total")}: <b className="text-ink">{nf.format(total)}</b>
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Jadval ko'rinishi — ekran o'quvchilari va aniq raqamlar uchun */}
        <details className="mt-6 border-t border-line pt-4">
          <summary className="cursor-pointer text-[14px] font-medium text-brand hover:underline">
            {t("statistics.tableToggle")}
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-3 font-medium">{t("statistics.trade")}</th>
                  <th className="py-2 pr-3 text-right font-medium">{t("statistics.formal")}</th>
                  <th className="py-2 pr-3 text-right font-medium">{t("statistics.informal")}</th>
                  <th className="py-2 text-right font-medium">{t("statistics.total")}</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {TRADE_STATS.map((s) => (
                  <tr key={s.key} className="border-b border-line/70">
                    <td className="py-2 pr-3">{name(s.key)}</td>
                    <td className="py-2 pr-3 text-right">{nf.format(s.formal)}</td>
                    <td className="py-2 pr-3 text-right">{nf.format(s.informal)}</td>
                    <td className="py-2 text-right font-semibold">{nf.format(s.formal + s.informal)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2 pr-3">{t("statistics.total")}</td>
                  <td className="py-2 pr-3 text-right">{nf.format(MASTERS.formal)}</td>
                  <td className="py-2 pr-3 text-right">{nf.format(MASTERS.informal)}</td>
                  <td className="py-2 text-right">{nf.format(MASTERS.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <figcaption className="mt-5 flex gap-2 text-[13px] text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t("statistics.source")} {t("statistics.definition")}
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}
