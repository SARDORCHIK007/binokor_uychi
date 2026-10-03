import { useTranslation } from "react-i18next";
import { LANGS, storeLang, type Lang } from "../../i18n";

export function LangSwitch({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const current: Lang = i18n.language === "en" ? "en" : "uz";

  const select = (lang: Lang) => {
    void i18n.changeLanguage(lang);
    storeLang(lang);
  };

  return (
    <div role="group" aria-label={t("nav.langLabel")} className={`flex items-center rounded-full border border-line bg-surface p-1 text-xs font-bold ${className}`}>
      {LANGS.map((lang) => (
        <span key={lang} className="flex items-center">
          <button
            type="button"
            onClick={() => select(lang)}
            aria-pressed={current === lang}
            aria-label={lang === "uz" ? "UZ — O'zbekcha" : "EN — English"}
            className={`rounded-full px-3 py-1.5 uppercase tracking-wider transition-colors ${
              current === lang ? "bg-amber text-ink" : "text-muted hover:text-white"
            }`}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  );
}
