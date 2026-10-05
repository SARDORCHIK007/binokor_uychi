import { useTranslation } from "react-i18next";
import { Building2, Landmark, Users, type LucideIcon } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

interface Benefit {
  title: string;
  text: string;
}

const ICONS: LucideIcon[] = [Users, Building2, Landmark];

/** Dastur nimani beradi: aholi, tuman, davlat uchun. */
export function Benefits() {
  const { t } = useTranslation();
  const items = useList<Benefit>("results.benefits");

  return (
    <Section id="benefits" tone="white">
      <SectionTitle id="benefits-title">{t("results.benefitsTitle")}</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((b, i) => {
          const Icon = ICONS[i] ?? Users;
          return (
            <article key={b.title} className="card border-t-4 border-t-brand p-6">
              <Icon className="mb-4 h-7 w-7 text-brand" aria-hidden="true" />
              <h3 className="mb-2 text-h3">{b.title}</h3>
              <p className="text-[15px] text-muted">{b.text}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
