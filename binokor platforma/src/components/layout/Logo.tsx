import { useTranslation } from "react-i18next";

/** Namangan davlat texnika universiteti logotipi (`public/partners/namdtu.webp`). */
export function LogoMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src="/partners/namdtu.webp"
      width={360}
      height={360}
      alt=""
      aria-hidden="true"
      className={`shrink-0 rounded-full bg-white object-contain ${className}`}
    />
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useTranslation();
  return (
    <span className="flex items-center gap-3">
      <LogoMark className={inverted ? "h-14 w-14 p-0.5" : "h-12 w-12"} />
      <span className="leading-tight">
        <span
          className={`block font-heading text-[18px] font-extrabold tracking-[-0.01em] ${inverted ? "text-white" : "text-ink"}`}
        >
          UYCHI<span className={inverted ? "text-[#F5A623]" : "text-brand"}> BUILDERS</span>
        </span>
        <span className={`block text-[12px] ${inverted ? "text-white/75" : "text-muted"}`}>
          {t("brand.university")}
        </span>
      </span>
    </span>
  );
}
