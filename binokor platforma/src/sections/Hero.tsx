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

  // Fon videosi to'xtovsiz aylanadi (video fayl qora boshi/oxirisiz kesilgan, `loop`).
  // Brauzer videoni to'xtatib qo'ysa (tab almashtirilganda, internet sekinlashganda) — davom ettiramiz.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // ba'zi brauzerlar ovozsiz bo'lmasa avtomatik o'ynatmaydi
    const play = () => {
      if (document.visibilityState === "visible" && v.paused) v.play().catch(() => {});
    };
    const restart = () => {
      v.currentTime = 0;
      play();
    };
    play();
    v.addEventListener("canplay", play);
    v.addEventListener("pause", play);
    v.addEventListener("stalled", play);
    v.addEventListener("ended", restart);
    document.addEventListener("visibilitychange", play);
    const timer = window.setInterval(play, 2000);
    return () => {
      v.removeEventListener("canplay", play);
      v.removeEventListener("pause", play);
      v.removeEventListener("stalled", play);
      v.removeEventListener("ended", restart);
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
