import { useTranslation } from "react-i18next";
import { INITIATOR_INDEX, PARTNER_INITIALS, PARTNER_LOGOS } from "../data/partners";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

/** Logotip yoki (rasmiy logotip bo'lmasa) bosh harflar */
function PartnerLogo({ i, name, size }: { i: number; name: string; size: "lg" | "md" }) {
  const { t } = useTranslation();
  const logo = PARTNER_LOGOS[i];
  if (!logo) {
    return (
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full bg-brand font-heading font-bold text-white ${
          size === "lg" ? "h-24 w-24 text-[18px]" : "h-16 w-16 text-[14px]"
        }`}
      >
        {PARTNER_INITIALS[i] || name.slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={logo.src}
      alt={t("partners.logoAlt", { name })}
      width={logo.w}
      height={logo.h}
      loading="lazy"
      className={`w-auto max-w-full object-contain ${size === "lg" ? "max-h-24" : "max-h-16"}`}
    />
  );
}

export function Partners() {
  const { t } = useTranslation();
  const names = useList<string>("partners.list");
  const roles = useList<string>("partners.roles");
  const others = names.map((_, i) => i).filter((i) => i !== INITIATOR_INDEX);

  return (
    <Section id="partners" tone="white">
      <SectionTitle id="partners-title">{t("partners.title")}</SectionTitle>

      {names[INITIATOR_INDEX] && (
        <div className="card mb-4 grid items-center gap-6 border-l-4 border-l-brand p-6 md:grid-cols-[140px_1fr]">
          <div className="flex justify-center">
            <PartnerLogo i={INITIATOR_INDEX} name={names[INITIATOR_INDEX]} size="lg" />
          </div>
          <div>
            <p className="kicker">{t("partners.initiatorBadge")}</p>
            <h3 className="text-[20px] lg:text-[22px]">{names[INITIATOR_INDEX]}</h3>
            <p className="mt-2 text-muted">{roles[INITIATOR_INDEX]}</p>
          </div>
        </div>
      )}

      <ul className="grid gap-4 md:grid-cols-3">
        {others.map((i) => (
          <li key={names[i]} className="card flex items-center gap-4 p-5">
            <div className="flex h-16 w-20 shrink-0 items-center justify-center">
              <PartnerLogo i={i} name={names[i]} size="md" />
            </div>
            <div>
              <h3 className="text-[16px]">{names[i]}</h3>
              <p className="mt-1 text-[14px] text-muted">{roles[i]}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
