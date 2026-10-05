import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  ChevronRight,
  Globe2,
  Handshake,
  HardHat,
  Layers,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { CONFIG } from "../config";
import { useList } from "../hooks/useList";

interface Item {
  title: string;
  text: string;
}

/** Tartib `quick.items` bilan bir xil */
const LINKS: { href: string; icon: LucideIcon; external?: boolean }[] = [
  { href: "#trades", icon: HardHat },
  { href: "#program", icon: Layers },
  { href: "#international", icon: Globe2 },
  { href: "#roadmap", icon: CalendarDays },
  { href: "#partners", icon: Handshake },
  { href: CONFIG.mapUrl, icon: MapPin, external: true },
];

/** Davlat xizmatlari saytlaridagi kabi tezkor havola plitkalari. */
export function QuickLinks() {
  const { t } = useTranslation();
  const items = useList<Item>("quick.items");

  return (
    <section aria-labelledby="quick-title" className="border-b border-line bg-soft">
      <div className="container-content py-8">
        <h2 id="quick-title" className="sr-only">
          {t("quick.title")}
        </h2>
        <ul className="grid gap-3 xs:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const link = LINKS[i];
            if (!link) return null;
            const Icon = link.icon;
            return (
              <li key={item.title}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card card-link group flex h-full items-center gap-4 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-[15px] font-bold text-ink">{item.title}</span>
                    <span className="block text-[13px] text-muted">{item.text}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
