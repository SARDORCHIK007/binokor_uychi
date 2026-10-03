import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  m,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Globe2, GraduationCap, Home, Languages, Users, type LucideIcon } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ICONS: LucideIcon[] = [Users, GraduationCap, Home, Languages, Globe2];

interface Step {
  title: string;
  text: string;
}

/** Ikki tugun orasidagi SVG chiziq; `stroke-dashoffset` scroll bilan o'zgaradi. */
function Segment({
  progress,
  index,
  total,
  vertical,
  reduced,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  vertical: boolean;
  reduced: boolean;
}) {
  const span = 1 / (total - 1);
  const length = useTransform(progress, [index * span, (index + 1) * span], [0, 1]);
  const coords = vertical
    ? { x1: "2", y1: "0", x2: "2", y2: "100%" }
    : { x1: "0", y1: "2", x2: "100%", y2: "2" };

  return (
    <svg
      aria-hidden="true"
      className={
        vertical
          ? "absolute left-[26px] top-[60px] h-[calc(100%-64px)] w-1 lg:hidden"
          : "absolute left-[calc(50%+32px)] top-[26px] hidden h-1 w-[calc(100%-40px)] lg:block"
      }
    >
      <line {...coords} stroke="#1D2A42" strokeWidth="2" />
      <m.line
        {...coords}
        stroke="#F5A623"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: reduced ? 1 : length }}
      />
    </svg>
  );
}

export function Model() {
  const { t } = useTranslation();
  const steps = useList<Step>("model.steps");
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.8"] });
  const [active, setActive] = useState(reduced ? steps.length : 0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const reached = Math.floor(p * (steps.length - 1) + 0.02) + 1;
    setActive((prev) => Math.max(prev, Math.min(reached, steps.length)));
  });

  const isActive = (i: number) => reduced || i < active;

  return (
    <Section id="model" tone="raised">
      <SectionTitle id="model-title" eyebrow={`02 — ${t("nav.model")}`} intro={t("model.intro")}>
        {t("model.title")}
      </SectionTitle>

      <ol ref={listRef} className="relative grid gap-0 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? Users;
          const on = isActive(i);
          const last = i === steps.length - 1;
          return (
            <li key={i} className="relative flex gap-5 pb-8 lg:flex-col lg:gap-6 lg:pb-0">
              {!last && (
                <>
                  <Segment progress={scrollYProgress} index={i} total={steps.length} vertical reduced={reduced} />
                  <Segment progress={scrollYProgress} index={i} total={steps.length} vertical={false} reduced={reduced} />
                </>
              )}
              <span
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 lg:mx-auto ${
                  on ? "border-amber bg-amber text-ink shadow-[0_0_0_6px_rgba(245,166,35,.12)]" : "border-line-strong bg-deep text-muted"
                }`}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">{i + 1}</span>
              </span>
              <m.div
                className="card-dark flex-1 p-5 lg:p-6"
                initial={false}
                animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
              >
                <p className="mb-1 font-heading text-sm font-bold text-amber">0{i + 1}</p>
                <h3 className="mb-2 text-h3 text-white">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{step.text}</p>
              </m.div>
            </li>
          );
        })}
      </ol>

      <m.p
        className="mx-auto mt-16 max-w-4xl rounded-card border border-amber/30 bg-amber-soft px-6 py-8 text-center font-heading text-h3 text-white lg:mt-24 lg:px-10 lg:text-[30px] lg:leading-tight"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        {t("model.highlight")}
      </m.p>
    </Section>
  );
}
