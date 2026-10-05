import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";
import { Button } from "../components/ui/Button";
import { useList } from "../hooks/useList";

interface Fact {
  label: string;
  value: string;
}

/** Bosh banner: dastur nomi, maqsadi va asosiy ma'lumotlar jadvali. */
export function Hero() {
  const { t } = useTranslation();
  const facts = useList<Fact>("hero.facts");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Videoning boshi (0–2.5 s) va oxiri (73.5 s dan keyin) qora rangga o'tadi —
  // shuning uchun faqat yorug' qismi to'xtovsiz aylantiriladi.
  // "Harakatni kamaytirish" yoqilgan bo'lsa, video o'ynamaydi — faqat poster ko'rinadi.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    const LOOP_START = 2.5;
    const LOOP_END = 73.3;
    const play = () => {
      if (document.visibilityState === "visible" && v.paused) v.play().catch(() => {});
    };
    const toStart = () => {
      v.currentTime = LOOP_START;
      play();
    };
    const onTime = () => {
      if (v.currentTime >= LOOP_END || v.currentTime < LOOP_START - 0.5) toStart();
    };
    const onMeta = () => {
      if (v.currentTime < LOOP_START) v.currentTime = LOOP_START;
    };
    if (v.readyState >= 1) onMeta();
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", toStart);
    // Brauzer videoni to'xtatib qo'ysa (tab almashtirilganda, internet sekinlashganda) — davom ettiramiz
    v.addEventListener("pause", play);
    v.addEventListener("stalled", play);
    document.addEventListener("visibilitychange", play);
    const timer = window.setInterval(play, 3000);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", toStart);
      v.removeEventListener("pause", play);
      v.removeEventListener("stalled", play);
      document.removeEventListener("visibilitychange", play);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-700 text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/video/hero.mp4"
        poster="/video/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Matn o'qilishi uchun to'q ko'k qatlam */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-700/90 via-brand-700/75 to-brand-700/55" />
      <div className="container-content grid gap-10 py-12 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-3 inline-flex rounded border border-white/30 px-2.5 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-white/90">
            {t("hero.kicker")}
          </p>
          <h1 id="hero-title" className="text-h1 !text-white lg:text-h1-lg">
            {t("hero.subtitle")}
          </h1>
          <div className="mt-6 max-w-xl border-l-2 border-gold pl-4">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">{t("hero.goalLabel")}</p>
            <p className="mt-1 text-[16px] leading-relaxed text-white/90 lg:text-[17px]">{t("hero.goal")}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#program" variant="light">
              {t("hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="#contact" className="border border-white/40 !bg-transparent hover:!bg-white/10">
              {t("hero.ctaSecondary")}
            </Button>
          </div>
        </div>

        <div className="rounded-card bg-white p-6 text-ink shadow-card">
          <h2 className="mb-4 font-heading text-[17px] font-bold">{t("hero.factsTitle")}</h2>
          <dl className="divide-y divide-line">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[130px_1fr] gap-3 py-3 text-[15px]">
                <dt className="text-muted">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={CONFIG.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-brand hover:underline"
          >
            {t("common.map")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">({t("common.newTab")})</span>
          </a>
        </div>
      </div>
    </section>
  );
}
