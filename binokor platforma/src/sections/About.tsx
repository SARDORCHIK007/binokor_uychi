import { useTranslation } from "react-i18next";
import { BadgeX, Building2, HardHat, Landmark, Languages, MapPin, type LucideIcon } from "lucide-react";
import { CAMPUS_PHOTO } from "../data/partners";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

interface Fact {
  label: string;
  value: string;
}
interface Problem {
  title: string;
  text: string;
}

const PROBLEM_ICONS: LucideIcon[] = [BadgeX, Languages, HardHat];
/** Ko'rsatiladigan faktlar: manzil va o'quv binosi (qolganlari tasdiqlangach qo'shiladi) */
const FACT_ICONS: LucideIcon[] = [MapPin, Building2];

export function About() {
  const { t } = useTranslation();
  const facts = useList<Fact>("campus.facts").slice(0, FACT_ICONS.length);
  const problems = useList<Problem>("problem.cards");

  return (
    <Section id="about" tone="white">
      <SectionTitle id="about-title" intro={t("campus.intro")}>
        {t("about.title")}
      </SectionTitle>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Fakultet binosi: rasmiy foto bo'lsa — foto, bo'lmasa — ko'k panel */}
        {CAMPUS_PHOTO ? (
          <img
            src={CAMPUS_PHOTO.src1600}
            srcSet={`${CAMPUS_PHOTO.src800} 800w, ${CAMPUS_PHOTO.src1600} 1600w`}
            sizes="(min-width: 1024px) 680px, 100vw"
            width={1600}
            height={738}
            loading="lazy"
            alt={t("campus.imageAlt")}
            className="aspect-[16/9] w-full rounded-card border border-line object-cover"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-card bg-brand-50 text-center text-brand">
            <Landmark className="mb-3 h-12 w-12" aria-hidden="true" />
            <p className="font-heading text-[18px] font-bold">{t("about.place")}</p>
            <p className="text-[14px] text-muted">
              {t("brand.university")} · {t("brand.location")}
            </p>
          </div>
        )}

        <ul className="grid content-start gap-3">
          {facts.map((f, i) => {
            const Icon = FACT_ICONS[i];
            return (
              <li key={f.label} className="card flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[13px] text-muted">{f.label}</span>
                  <span className="block font-medium">{f.value}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <h3 className="mb-5 mt-14 text-[20px] lg:text-[22px]">{t("problem.title")}</h3>
      <p className="mb-6 max-w-3xl text-muted">{t("problem.intro")}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((p, i) => {
          const Icon = PROBLEM_ICONS[i] ?? BadgeX;
          return (
            <article key={p.title} className="card p-6">
              <Icon className="mb-4 h-7 w-7 text-brand" aria-hidden="true" />
              <h4 className="mb-2 text-h3">{p.title.replace(/\.$/, "")}</h4>
              <p className="text-[15px] text-muted">{p.text}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
