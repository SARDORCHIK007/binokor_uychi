import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";
import { CONFIG } from "../config";
import { Button } from "../components/ui/Button";
import { useList } from "../hooks/useList";

interface Stat {
  value: string;
  label: string;
}

/** Bosh ekran: fon videosi, dastur nomi va maqsadi, ostida asosiy raqamlar. */
export function Hero() {
  const { t } = useTranslation();
  const stats = useList<Stat>("stats.items");
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
    <>
      <section
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-brand-700 text-white lg:min-h-[calc(100svh-112px)]"
      >
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
        {/* Matn o'qilishi uchun: chapda to'q, o'ngda video ochiq ko'rinadi */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061F36]/90 via-[#0A365C]/60 to-[#0A365C]/10"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#061F36]/70 to-transparent" />

        <div className="container-content w-full pb-24 pt-14 lg:pb-32 lg:pt-16">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 border-l-4 border-gold bg-[#061F36]/60 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white lg:text-[13px]">
              {t("hero.kicker")}
            </p>
            <h1
              id="hero-title"
              className="font-heading text-[36px] font-extrabold leading-[1.08] !text-white xs:text-[40px] md:text-[52px] lg:text-[64px]"
            >
              {t("hero.subtitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/90 lg:text-[19px]">{t("hero.goal")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#program" variant="light" className="!px-6 !py-3.5 text-[15px]">
                {t("hero.ctaPrimary")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#contact" className="border border-white/50 !bg-transparent !px-6 !py-3.5 text-[15px] hover:!bg-white/10">
                {t("hero.ctaSecondary")}
              </Button>
            </div>
            <a
              href={CONFIG.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[14px] text-white/85 hover:text-white hover:underline"
            >
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              {t("hero.location")}
              <span className="sr-only">({t("common.newTab")})</span>
            </a>
          </div>
        </div>
      </section>

      {/* Asosiy raqamlar — bosh ekranga qisman chiqib turadigan oq panel */}
      <section aria-labelledby="stats-title" className="relative z-10 flow-root bg-soft">
        <div className="container-content">
          <h2 id="stats-title" className="sr-only">
            {t("stats.title")}
          </h2>
          <dl className="-mt-14 grid grid-cols-2 overflow-hidden rounded-card border border-line bg-white shadow-card-hover lg:-mt-16 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse gap-1 px-5 py-6 lg:px-8 lg:py-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                  i >= 2 ? "border-t border-line lg:border-t-0" : ""
                } ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="text-[14px] leading-snug text-muted lg:text-[15px]">{s.label}</dt>
                <dd className="font-heading text-[40px] font-extrabold leading-none text-brand lg:text-[52px]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
