import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { NAV_ITEMS } from "../../config";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const { t } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menuOpen")}
      className="fixed inset-0 z-[60] flex flex-col bg-ink text-white lg:hidden"
    >
      <div className="container-content flex h-[72px] items-center justify-between">
        <Logo />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("nav.menuClose")}
          className="rounded-lg p-2 hover:bg-surface"
        >
          <X className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
      <nav className="container-content flex flex-1 flex-col gap-1 pt-6">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onClose}
            className="border-b border-line py-4 font-heading text-2xl font-bold hover:text-amber"
          >
            {t(item.key)}
          </a>
        ))}
        <LangSwitch className="mt-8 text-lg" />
      </nav>
    </div>
  );
}
