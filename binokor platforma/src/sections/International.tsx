import { lazy, Suspense, useRef, useState, type MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Flag, FLAG_CODES } from "../components/ui/Flag";
import { useInView } from "../hooks/useInView";
import { useIsMobile } from "../hooks/useIsMobile";
import { useList } from "../hooks/useList";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLSupport } from "../hooks/useWebGLSupport";

const GlobeScene = lazy(() => import("../components/three/globe/GlobeScene"));

export interface Country {
  name: string;
  language: string;
  requirements: string;
  trades: string;
}

function GlobeFallback({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="h-full w-full rounded-full bg-surface" aria-hidden="true" />;
  return (
    <img
      src="/fallback/globe.webp"
      alt={alt}
      width={800}
      height={800}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
}

export function International() {
  const { t } = useTranslation();
  const countries = useList<Country>("international.countries");
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const mobile = useIsMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  // 3D globus ekranga 200px qolganda yuklanadi; ko'rinmasa to'xtaydi
  const [nearRef, near] = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const [visRef, visible] = useInView<HTMLDivElement>({ rootMargin: "0px" });
  // Yoylar globusning o'zi ekrandan o'tayotganda chiziladi (mobilda ham)
  const globeRef = useRef<HTMLDivElement | null>(null);
  const setGlobeRef = (el: HTMLDivElement | null) => {
    globeRef.current = el;
    (visRef as MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <Section id="international" tone="base">
      <SectionTitle id="international-title" eyebrow={`05 — ${t("nav.international")}`} intro={t("international.intro")}>
        {t("international.title")}
      </SectionTitle>

      <div ref={nearRef} className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          ref={setGlobeRef}
          className="relative mx-auto aspect-square w-full max-w-[460px] lg:sticky lg:top-28 lg:max-w-none lg:self-start"
        >
          {webgl ? (
            near && (
              <Suspense fallback={null}>
                <GlobeScene
                  triggerRef={globeRef}
                  hovered={hovered}
                  reduced={reduced}
                  active={visible}
                  mobile={mobile}
                  label={t("international.globeAlt")}
                />
              </Suspense>
            )
          ) : (
            <GlobeFallback alt={t("international.globeAlt")} />
          )}
        </div>

        <ul className="space-y-4" onMouseLeave={() => setHovered(null)}>
          {countries.map((c, i) => (
            <m.li
              key={c.name}
              tabIndex={0}
              aria-label={c.name}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered(i)}
              className={`card-dark cursor-default p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                hovered === i ? "!border-amber/70" : ""
              }`}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <h3 className="mb-4 flex items-center gap-3 text-h3 text-white">
                <Flag code={FLAG_CODES[i]} />
                {c.name}
              </h3>
              <dl className="grid gap-3 text-[15px] md:grid-cols-[auto_1fr] md:gap-x-6">
                <dt className="text-muted">{t("international.labels.language")}</dt>
                <dd className="font-medium">{c.language}</dd>
                <dt className="text-muted">{t("international.labels.requirements")}</dt>
                <dd>{c.requirements}</dd>
                <dt className="text-muted">{t("international.labels.trades")}</dt>
                <dd>{c.trades}</dd>
              </dl>
            </m.li>
          ))}
        </ul>
      </div>

      <p className="mt-10 max-w-3xl border-l-2 border-amber/50 pl-4 text-sm text-muted">{t("international.note")}</p>
    </Section>
  );
}
