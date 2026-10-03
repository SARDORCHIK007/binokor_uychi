import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import {
  Briefcase,
  Building2,
  Globe2,
  HardHat,
  Handshake,
  Landmark,
  Layers,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Counter } from "../components/ui/Counter";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Raqamlar shu yerda; yozuvlar `locales/*.json` dagi `results.stats` da. */
const STATS: { value: number; suffix: string; icon: LucideIcon }[] = [
  { value: 1000, suffix: "+", icon: HardHat },
  { value: 30, suffix: "+", icon: Wrench },
  { value: 500, suffix: "+", icon: Briefcase },
  { value: 5, suffix: "", icon: Globe2 },
  { value: 4, suffix: "", icon: Handshake },
  { value: 3, suffix: "", icon: Layers },
];

const BENEFIT_ICONS: LucideIcon[] = [Users, Building2, Landmark];

interface Benefit {
  title: string;
  text: string;
}

export function Results() {
  const { t } = useTranslation();
  const labels = useList<string>("results.stats");
  const benefits = useList<Benefit>("results.benefits");
  const reduced = useReducedMotion();

  return (
    <Section id="results" tone="raised">
      <SectionTitle id="results-title" eyebrow={`06 — ${t("nav.results")}`}>
        {t("results.title")}
      </SectionTitle>

      <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {STATS.map(({ value, suffix, icon: Icon }, i) => (
          <m.li
            key={i}
            className="card-dark card-dark-hover flex flex-col gap-5 p-7"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber/25 bg-amber-soft text-amber">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <Counter
                value={value}
                suffix={suffix}
                className="block font-heading text-[44px] font-extrabold leading-none tracking-tight text-white lg:text-[60px]"
              />
              <span className="mt-3 block text-muted">{labels[i]}</span>
            </div>
          </m.li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">{t("results.note")}</p>

      <div className="mt-16 lg:mt-24">
        <h3 className="mb-8 text-h3 text-white lg:text-[32px]">{t("results.benefitsTitle")}</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i] ?? Users;
            return (
              <m.div
                key={i}
                className="card-dark relative overflow-hidden p-8 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-amber"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Icon className="mb-4 h-7 w-7 text-amber" aria-hidden="true" />
                <h4 className="mb-2 font-heading text-h3">{b.title}</h4>
                <p className="text-muted">{b.text}</p>
              </m.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
