import { lazy, Suspense, useRef, useState, type MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, MapPin } from "lucide-react";
import { CONFIG } from "../config";
import { PARTNER_LOGOS, INITIATOR_INDEX } from "../data/partners";
import { Button } from "../components/ui/Button";
import { useList } from "../hooks/useList";
import { useIdle } from "../hooks/useIdle";
import { useInView } from "../hooks/useInView";
import { useIsMobile } from "../hooks/useIsMobile";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLSupport } from "../hooks/useWebGLSupport";

// 3D alohida bo'lak (chunk) sifatida yuklanadi — birinchi JS yengil qoladi
const HeroScene = lazy(() => import("../components/three/hero/HeroScene"));

function HeroFallback({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src="/fallback/hero.webp"
      alt={alt}
      width={1200}
      height={900}
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover object-[78%_60%] lg:object-center"
    />
  );
}

export function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const mobile = useIsMobile(1024);
  const [sectionRef, inView] = useInView<HTMLElement>({ rootMargin: "0px" });
  // Hero'dan uzoqlashganda canvas o'chiriladi (WebGL konteksti bo'shaydi)
  const [nearRef, near] = useInView<HTMLDivElement>({ rootMargin: "300px" });
  // 3D birinchi ko'rinishdan keyin yuklanadi — matn va tugmalar darhol chiqadi
  const idle = useIdle();
  // Sarlavha: birinchi so'z oq, qolgani amber ("UYCHI BUILDERS")
  const [titleFirst, ...rest] = t("hero.title").split(" ");
  const titleRest = rest.join(" ");
  const partners = useList<string>("partners.list");

  // Scroll-timeline uchun alohida ref (useInView ref'i bilan bir element)
  const triggerRef = useRef<HTMLElement | null>(null);
  const setRefs = (el: HTMLElement | null) => {
    triggerRef.current = el;
    (sectionRef as MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <section
      ref={setRefs}
      id="hero"
      aria-labelledby="hero-title"
      className={`relative bg-ink text-white ${reduced || !webgl ? "h-[100svh] min-h-[640px]" : "h-[300vh]"}`}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_72%_18%,#173360_0%,#0B1730_42%,#070D18_78%)] lg:block">
        {/* Tungi osmon ustida nozik chizma to'ri */}
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        {/* 3D sahna: mobilda tepada, desktopda butun fon */}
        <div className="relative min-h-[190px] flex-1 pt-[72px] lg:absolute lg:inset-0 lg:pt-0">
          <div ref={nearRef} className="absolute inset-0 top-[72px] lg:top-0">
            {webgl ? (
              idle &&
              near && (
              <Suspense fallback={null}>
                <HeroScene
                  triggerRef={triggerRef}
                  reduced={reduced}
                  active={inView}
                  mobile={mobile}
                />
              </Suspense>
              )
            ) : (
              <HeroFallback alt={t("hero.sceneAlt")} />
            )}
          </div>
          {/* Mobil: 3D maydon pastidan matnga yumshoq o'tish */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0A1426] lg:hidden"
          />
        </div>

        {/* Desktop: matn o'qilishi uchun chapdan so'nuvchi to'q fon (blur yo'q) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/60 to-transparent lg:block lg:w-[60%]"
        />

        {/* Matn bloki: mobilda pastda, desktopda chapda */}
        <div className="pointer-events-none relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center lg:pb-20">
          <div className="container-content pb-4 pt-0 lg:py-0">
            <div className="pointer-events-auto max-w-[660px]">
              {/* Asosiy tashabbuskor — NamDTU */}
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-line-strong bg-ink py-1.5 pl-1.5 pr-5 lg:mb-7">
                <img
                  src={PARTNER_LOGOS[INITIATOR_INDEX].src}
                  alt=""
                  width={44}
                  height={44}
                  className="h-9 w-9 shrink-0 rounded-full bg-white object-contain lg:h-11 lg:w-11"
                />
                <span className="leading-tight">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-amber lg:text-[11px]">
                    {t("hero.initiatorLabel")}
                  </span>
                  <span className="block text-[13px] font-bold text-white lg:text-[15px]">{t("hero.initiator")}</span>
                </span>
              </div>

              <p className="eyebrow mb-3 hidden lg:mb-5 lg:inline-flex">{t("hero.eyebrow")}</p>
              <h1 id="hero-title" className="text-h1 lg:text-h1-lg">
                {titleFirst} <span className="text-amber">{titleRest}</span>
              </h1>
              <p className="mt-2 font-heading text-[15px] font-bold text-white xs:text-[16px] lg:mt-5 lg:text-[26px]">
                {t("hero.subtitle")}
              </p>

              {/* Loyiha maqsadi */}
              <div className="mt-6 hidden max-w-[560px] border-l-2 border-amber pl-4 lg:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">{t("hero.goalLabel")}</p>
                <p className="mt-1.5 text-[17px] leading-relaxed text-muted">{t("hero.goal")}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 lg:mt-8 lg:gap-4">
                <Button href="#model" className="!px-4 !py-2.5 !text-[13px] lg:!px-7 lg:!py-3.5 lg:!text-[15px]">
                  {t("hero.ctaPrimary")}
                </Button>
                <Button href="#contact" variant="outline" className="!px-4 !py-2.5 !text-[13px] lg:!px-7 lg:!py-3.5 lg:!text-[15px]">
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ma'lumot paneli: o'quv maskani (xarita) va hamkorlar */}
        <div className="relative z-10 border-t border-line bg-ink lg:absolute lg:inset-x-0 lg:bottom-0">
          <div className="container-content flex flex-col gap-2.5 py-3 lg:flex-row lg:items-center lg:justify-between lg:py-4">
            <a
              href={CONFIG.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-w-0 items-center gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber/25 bg-amber-soft text-amber">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {t("hero.locationLabel")}
                  <span className="normal-case tracking-normal text-amber lg:hidden"> · {t("common.map")} ↗</span>
                </span>
                <span className="block text-[13px] font-bold text-white lg:text-[14px]">{t("hero.location")}</span>
              </span>
              <span className="ml-1 hidden shrink-0 items-center gap-1 text-[13px] font-bold text-amber group-hover:underline lg:inline-flex">
                {t("common.map")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="sr-only">
                {t("common.map")} ({t("common.newTab")})
              </span>
            </a>

            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-muted md:inline">
                {t("hero.partnersLabel")}
              </span>
              <ul className="flex items-center gap-2" aria-label={t("hero.partnersLabel")}>
                {PARTNER_LOGOS.map((logo, i) => (
                  <li
                    key={i}
                    className="flex h-9 items-center justify-center rounded-lg bg-white px-2 lg:h-10"
                    title={partners[i]}
                  >
                    <img
                      src={logo.src}
                      alt={partners[i] ?? ""}
                      width={logo.w}
                      height={logo.h}
                      className="h-6 w-auto max-w-[72px] object-contain lg:h-7"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
