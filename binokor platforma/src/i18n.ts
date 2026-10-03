import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz.json";
import en from "./locales/en.json";

export const LANGS = ["uz", "en"] as const;
export type Lang = (typeof LANGS)[number];

const STORAGE_KEY = "uychi-lang";

function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "uz" || v === "en") return v;
  } catch {
    /* localStorage mavjud emas */
  }
  return "uz";
}

export function storeLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* e'tiborsiz */
  }
}

const initial = readStoredLang();

void i18n.use(initReactI18next).init({
  resources: { uz: { translation: uz }, en: { translation: en } },
  lng: initial,
  fallbackLng: "uz",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

document.documentElement.lang = initial;
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
