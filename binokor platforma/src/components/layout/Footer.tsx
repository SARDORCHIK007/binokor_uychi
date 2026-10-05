import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONFIG, NAV_ITEMS } from "../../config";
import { useList } from "../../hooks/useList";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  const partners = useList<string>("partners.list");

  return (
    <footer className="bg-brand-700 text-white">
      <div className="container-content grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-sm text-[14px] text-white/75">{t("brand.slogan")}</p>
          <ul className="mt-5 space-y-2 text-[14px] text-white/85">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={CONFIG.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {CONFIG.address}
              </a>
            </li>
            {CONFIG.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                  {CONFIG.phone}
                </a>
              </li>
            )}
            {CONFIG.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${CONFIG.email}`} className="hover:underline">
                  {CONFIG.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider !text-white/70">{t("footer.partners")}</h3>
          <ul className="space-y-2 text-[14px] text-white/85">
            {partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <nav aria-label={t("footer.menu")}>
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider !text-white/70">{t("footer.menu")}</h3>
          <ul className="grid grid-cols-2 gap-2 text-[14px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-white/85 hover:text-white hover:underline">
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="container-content py-5 text-[13px] text-white/70">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}
