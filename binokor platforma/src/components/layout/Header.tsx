import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { m, useScroll, useSpring } from "framer-motion";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "../../config";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[72px] text-white transition-colors duration-300 ${
          scrolled ? "border-b border-line bg-ink" : "border-b border-transparent bg-transparent"
        }`}
      >
        <m.div
          className="absolute inset-x-0 top-0 h-[3px] origin-left bg-amber"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
        <div className="container-content flex h-full items-center justify-between gap-6">
          <a href="#hero" aria-label={`UYCHI BUILDERS — ${t("nav.toTop")}`} className="shrink-0 rounded-lg">
            <Logo />
          </a>

          <nav aria-label={t("nav.main")} className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[14px] font-medium text-muted transition-colors hover:text-white"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LangSwitch className="hidden lg:flex" />
            <a
              href="#contact"
              className="hidden rounded-full bg-amber px-5 py-2 font-heading text-[13px] font-bold text-ink transition-colors hover:bg-[#FFB840] xl:inline-flex"
            >
              {t("hero.ctaSecondary")}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.menuOpen")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="rounded-lg p-2 hover:bg-surface lg:hidden"
            >
              <Menu className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
