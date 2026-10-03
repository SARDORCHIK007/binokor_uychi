import { useTranslation } from "react-i18next";

/** Tarjima faylidagi massivni (ro'yxat, kartochkalar) tipli qilib qaytaradi. */
export function useList<T>(key: string): T[] {
  const { t } = useTranslation();
  const value = t(key, { returnObjects: true }) as unknown;
  return Array.isArray(value) ? (value as T[]) : [];
}
