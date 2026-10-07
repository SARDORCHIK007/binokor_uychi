import { useTranslation } from "react-i18next";
import { Globe2, GraduationCap, Home, Languages, Users, type LucideIcon } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

interface Step {
  title: string;
  text: string;
}

const ICONS: LucideIcon[] = [Users, GraduationCap, Home, Languages, Globe2];

/** Dastur modeli: 5 bosqichli zanjir (statik, animatsiyasiz). */
export function Program() {
  const { t } = useTranslation();
  const steps = useList<Step>("model.steps");

  return (
    <Section id="program" tone="white">
      <SectionTitle id="program-title" kicker={t("brand.program")} intro={t("model.intro")}>
        {t("model.title")}
      </SectionTitle>

      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => {
          const Icon = ICONS[i] ?? Users;
          return (
            <li key={s.title} className="card relative flex flex-col p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-heading text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-brand/70" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-h3">{s.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{s.text}</p>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 rounded-card border border-gold/40 bg-gold-50 px-5 py-4 text-center font-heading text-[16px] font-bold text-ink lg:text-[18px]">
        {t("model.highlight")}
      </p>
    </Section>
  );
}
