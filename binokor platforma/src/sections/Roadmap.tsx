import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { CONFIG } from "../config";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

interface Phase {
  title: string;
  items: string[];
}

export function Roadmap() {
  const { t } = useTranslation();
  const phases = useList<Phase>("roadmap.phases");

  /** `config.ts` dagi standart "N-bosqich" yozuvi tanlangan tilga tarjima qilinadi. */
  const phaseLabel = (i: number) => {
    const raw = CONFIG.PHASE_YEARS[i] ?? "";
    const m = /^(\d+)-bosqich$/.exec(raw);
    return m ? t("roadmap.phaseLabel", { n: m[1] }) : raw;
  };

  return (
    <Section id="roadmap" tone="soft">
      <SectionTitle id="roadmap-title">{t("roadmap.title")}</SectionTitle>

      <ol className="grid gap-4 md:grid-cols-3">
        {phases.map((phase, i) => (
          <li key={phase.title} className="card relative overflow-hidden p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-heading text-[14px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-[13px] font-medium uppercase tracking-wide text-brand">{phaseLabel(i)}</span>
            </div>
            <h3 className="mb-4 text-[20px]">{phase.title}</h3>
            <ul className="space-y-2.5">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
