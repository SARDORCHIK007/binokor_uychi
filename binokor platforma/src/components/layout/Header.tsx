import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Menu, Phone } from "lucide-react";
import { CONFIG, NAV_ITEMS } from "../../config";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/** Rasmiy sayt sarlavhasi: tepada xizmat paneli, ostida logotip va menyu. */
export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* Xizmat paneli */}
      <div className="bg-brand-700 text-white">
        <div className="container-content flex h-9 items-center justify-between gap-4 text-[13px]">
          <div className="flex min-w-0 items-center gap-5">
            <span className="hidden items-center gap-1.5 text-white/85 md:inline-flex">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {t("brand.university")} · {t("brand.location")}
            </span>
            {CONFIG.phone && (
              <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:underline">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {CONFIG.phone}
              </a>
            )}
            {CONFIG.email && (
              <a href={`mailto:${CONFIG.email}`} className="hidden items-center gap-1.5 hover:underline lg:inline-flex">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {CONFIG.email}
              </a>
            )}
          </div>
          <LangSwitch />
        </div>
      </div>

      {/* Asosiy sarlavha */}
      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="container-content flex h-[76px] items-center justify-between gap-6">
          <a href="#top" aria-label={`${t("brand.name")} — ${t("nav.toTop")}`} className="shrink-0 rounded">
            <Logo />
          </a>

          <nav aria-label={t("nav.main")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="rounded-md px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.menuOpen")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-md p-2 text-ink hover:bg-soft lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
