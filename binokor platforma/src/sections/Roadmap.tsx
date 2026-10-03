import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { m, useScroll } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CONFIG } from "../config";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Phase {
  title: string;
  items: string[];
}

export function Roadmap() {
  const { t } = useTranslation();
  const phases = useList<Phase>("roadmap.phases");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.7"] });

  /** `config.ts` dagi standart "N-bosqich" yozuvi tanlangan tilga tarjima qilinadi. */
  const phaseLabel = (i: number) => {
    const raw = CONFIG.PHASE_YEARS[i] ?? "";
    const m = /^(\d+)-bosqich$/.exec(raw);
    return m ? t("roadmap.phaseLabel", { n: m[1] }) : raw;
  };

  return (
    <Section id="roadmap" tone="base">
      <SectionTitle id="roadmap-title" eyebrow={`07 — ${t("nav.roadmap")}`} center>
        {t("roadmap.title")}
      </SectionTitle>

      <ol ref={ref} className="relative mx-auto max-w-5xl">
        {/* Timeline chizig'i */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[19px] top-0 w-[2px] rounded bg-line md:left-1/2 md:-translate-x-1/2"
        >
          <m.div
            className="h-full w-full origin-top rounded bg-amber"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
        </div>

        {phases.map((phase, i) => {
          const right = i % 2 === 1;
          return (
            <li key={i} className="relative mb-12 pl-14 last:mb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-deep bg-amber font-heading font-extrabold text-ink shadow-[0_0_0_6px_rgba(245,166,35,.12)] md:left-1/2 md:-translate-x-1/2"
              >
                {i + 1}
              </span>
              <m.div
                className={`card-dark card-dark-hover p-7 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                initial={reduced ? false : { opacity: 0, x: right ? 48 : -48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="mb-3 inline-block rounded-md bg-amber px-2.5 py-1 font-heading text-xs font-bold uppercase tracking-wider text-ink">
                  {phaseLabel(i)}
                </p>
                <h3 className="mb-4 text-h3 text-white lg:text-h3-lg">{phase.title}</h3>
                <ul className="space-y-2.5">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2.5 text-muted ${right ? "" : "md:flex-row-reverse"}`}
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </m.div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
