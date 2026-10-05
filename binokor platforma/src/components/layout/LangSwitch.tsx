import { useTranslation } from "react-i18next";
import { LANGS, storeLang, type Lang } from "../../i18n";

/** Til almashtirgich (to'q ko'k panel ustida) */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const current: Lang = i18n.language === "en" ? "en" : "uz";

  const select = (lang: Lang) => {
    void i18n.changeLanguage(lang);
    storeLang(lang);
  };

  return (
    <div role="group" aria-label={t("nav.langLabel")} className={`flex items-center gap-1 text-[13px] ${className}`}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => select(lang)}
          aria-pressed={current === lang}
          aria-label={lang === "uz" ? "O'zbekcha" : "English"}
          className={`rounded px-2 py-0.5 font-medium transition-colors ${
            current === lang ? "bg-white text-brand-700" : "text-white/85 hover:text-white"
          }`}
        >
          {lang === "uz" ? "O'zbekcha" : "English"}
        </button>
      ))}
    </div>
  );
}
