import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { BadgeX, HardHat, Languages, type LucideIcon } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ICONS: LucideIcon[] = [BadgeX, Languages, HardHat];

interface ProblemCard {
  title: string;
  text: string;
}

export function Problem() {
  const { t } = useTranslation();
  const cards = useList<ProblemCard>("problem.cards");
  const reduced = useReducedMotion();

  return (
    <Section id="problem" tone="base">
      <SectionTitle id="problem-title" eyebrow={`01 — ${t("nav.project")}`} intro={t("problem.intro")}>
        {t("problem.title")}
      </SectionTitle>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = ICONS[i] ?? BadgeX;
          return (
            <m.article
              key={i}
              className="card-dark card-dark-hover group relative overflow-hidden p-8"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            >
              <span aria-hidden="true" className="absolute right-6 top-4 font-heading text-[64px] font-extrabold leading-none text-white/[0.04]">
                0{i + 1}
              </span>
              <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber/25 bg-amber-soft text-amber">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mb-3 text-h3 text-white lg:text-h3-lg">{card.title}</h3>
              <p className="text-muted">{card.text}</p>
            </m.article>
          );
        })}
      </div>
    </Section>
  );
}
