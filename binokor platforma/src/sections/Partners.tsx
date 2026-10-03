import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { Award } from "lucide-react";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { INITIATOR_INDEX, PARTNER_LOGOS } from "../data/partners";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

function Logo({ i, name, className }: { i: number; name: string; className: string }) {
  const { t } = useTranslation();
  const logo = PARTNER_LOGOS[i];
  return (
    <img
      src={logo.src}
      alt={t("partners.logoAlt", { name })}
      width={logo.w}
      height={logo.h}
      loading="lazy"
      className={`h-auto w-auto max-w-full object-contain ${className}`}
    />
  );
}

export function Partners() {
  const { t } = useTranslation();
  const names = useList<string>("partners.list");
  const roles = useList<string>("partners.roles");
  const reduced = useReducedMotion();
  const others = names.map((_, i) => i).filter((i) => i !== INITIATOR_INDEX);

  const reveal = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.5, delay },
  });

  return (
    <Section id="partners" tone="raised">
      <SectionTitle id="partners-title" eyebrow={`08 — ${t("nav.partners")}`}>
        {t("partners.title")}
      </SectionTitle>

      {/* Asosiy tashabbuskor — alohida katta kartochka */}
      {names[INITIATOR_INDEX] && (
        <m.div
          {...reveal(0)}
          className="relative mb-5 grid items-center gap-6 overflow-hidden rounded-card border border-amber/40 bg-surface p-6 shadow-card md:grid-cols-[220px_1fr] md:gap-10 md:p-8 lg:mb-6"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-amber" />
          <div className="flex h-[180px] items-center justify-center rounded-2xl bg-white p-5 md:h-[200px]">
            <Logo i={INITIATOR_INDEX} name={names[INITIATOR_INDEX]} className="max-h-full" />
          </div>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-ink">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              {t("partners.initiatorBadge")}
            </p>
            <h3 className="font-heading text-[24px] font-extrabold leading-tight text-white lg:text-[32px]">
              {names[INITIATOR_INDEX]}
            </h3>
            <p className="mt-3 max-w-xl text-muted lg:text-[18px]">{roles[INITIATOR_INDEX]}</p>
          </div>
        </m.div>
      )}

      <ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
        {others.map((i, k) => (
          <m.li
            key={names[i]}
            {...reveal(0.1 + k * 0.1)}
            whileHover={reduced ? undefined : { y: -6, transition: { duration: 0.25, delay: 0 } }}
            className="card-dark card-dark-hover flex flex-col items-center p-5 text-center"
          >
            {/* Logotiplar oq plastinkada — to'q yozuvli logotiplar ham aniq ko'rinadi */}
            <div className="mb-6 flex h-[150px] w-full items-center justify-center rounded-2xl bg-white p-5">
              <Logo i={i} name={names[i]} className="max-h-full" />
            </div>
            <h3 className="mb-2 px-2 font-heading text-[18px] font-bold leading-snug text-white">{names[i]}</h3>
            <p className="px-2 pb-2 text-[15px] text-muted">{roles[i]}</p>
          </m.li>
        ))}
      </ul>
    </Section>
  );
}
