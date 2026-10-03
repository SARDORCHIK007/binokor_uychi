import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "../../config";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  const partners = t("partners.list", { returnObjects: true }) as string[];

  return (
    <footer className="relative z-[1] border-t border-line bg-deep/80 py-16 text-white">
      <div className="container-content grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-muted">{t("brand.slogan")}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber">
            {t("footer.partners")}
          </h3>
          <ul className="space-y-2 text-muted">
            {partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <nav aria-label={t("footer.menu")}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber">
            {t("footer.menu")}
          </h3>
          <ul className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted hover:text-white">
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-content mt-14 border-t border-line pt-6 text-sm text-muted">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
