import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { Building2, ExternalLink, GraduationCap, MapPin, type LucideIcon } from "lucide-react";
import { CONFIG } from "../config";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Fact {
  label: string;
  value: string;
}

/** Tartib `campus.facts` bilan bir xil: manzil, bino, diplom. */
const ICONS: LucideIcon[] = [MapPin, Building2, GraduationCap];
/** Oxirgi (diplom haqidagi) kartochka urg'u bilan ajratiladi */
const HIGHLIGHT = 2;

export function Campus() {
  const { t } = useTranslation();
  const facts = useList<Fact>("campus.facts");
  const reduced = useReducedMotion();

  return (
    <Section id="campus" tone="base">
      <SectionTitle id="campus-title" eyebrow={`03 — ${t("nav.campus")}`} intro={t("campus.intro")}>
        {t("campus.title")}
      </SectionTitle>

      <m.figure
        className="relative overflow-hidden rounded-card border border-line shadow-card"
        initial={reduced ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <img
          src="/campus/namdtu-qurilish-1600.webp"
          srcSet="/campus/namdtu-qurilish-800.webp 800w, /campus/namdtu-qurilish-1600.webp 1600w"
          sizes="(min-width: 1248px) 1200px, 100vw"
          width={1600}
          height={738}
          loading="lazy"
          decoding="async"
          alt={t("campus.imageAlt")}
          className="aspect-[4/3] h-auto w-full object-cover md:aspect-[1600/738]"
        />
        {/* Pastki qismda kartochkalar uchun yumshoq to'q o'tish */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
        <figcaption className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-sm font-bold text-white lg:left-6 lg:top-6">
          <MapPin className="h-4 w-4 text-amber" aria-hidden="true" />
          {t("campus.badge")}
        </figcaption>
        <a
          href={CONFIG.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-heading text-sm font-bold text-ink transition-colors hover:bg-[#FFB840] lg:right-6 lg:top-6"
        >
          {t("common.map")}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">({t("common.newTab")})</span>
        </a>
      </m.figure>

      {/* Faktlar: desktopda rasm ustiga chiqib turadi */}
      <ul className="relative z-10 mt-4 grid gap-3 md:-mt-14 md:grid-cols-3 md:gap-4 md:px-6">
        {facts.map((f, i) => {
          const Icon = ICONS[i] ?? MapPin;
          const hl = i === HIGHLIGHT;
          return (
            <m.li
              key={f.label}
              className={`flex items-center gap-4 rounded-card border p-5 shadow-card ${
                hl ? "border-amber/50 bg-[#2A2012]" : "border-line bg-surface"
              }`}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  hl ? "bg-amber text-ink" : "border border-amber/25 bg-amber-soft text-amber"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted">{f.label}</p>
                <p className={hl ? "font-heading text-[17px] font-bold leading-snug text-white" : "font-medium text-white"}>
                  {f.value}
                </p>
              </div>
            </m.li>
          );
        })}
      </ul>
    </Section>
  );
}
