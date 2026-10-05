import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { Flag, FLAG_CODES } from "../components/ui/Flag";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useList } from "../hooks/useList";

interface Country {
  name: string;
  language: string;
  requirements: string;
  trades: string;
}

/** Xalqaro yo'nalishlar: rasmiy jadval (desktop) va kartochkalar (telefon). */
export function International() {
  const { t } = useTranslation();
  const countries = useList<Country>("international.countries");
  const L = (k: string) => t(`international.labels.${k}`);

  return (
    <Section id="international" tone="soft">
      <SectionTitle id="international-title" intro={t("international.intro")}>
        {t("international.title")}
      </SectionTitle>

      {/* Desktop: jadval */}
      <div className="card hidden overflow-hidden md:block">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-brand-50 text-[13px] uppercase tracking-wide text-brand-700">
            <tr>
              <th scope="col" className="px-5 py-3 font-bold">{L("country")}</th>
              <th scope="col" className="px-5 py-3 font-bold">{L("language")}</th>
              <th scope="col" className="px-5 py-3 font-bold">{L("requirements")}</th>
              <th scope="col" className="px-5 py-3 font-bold">{L("trades")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {countries.map((c, i) => (
              <tr key={c.name} className="align-top">
                <th scope="row" className="px-5 py-4 font-medium">
                  <span className="flex items-center gap-3">
                    <Flag code={FLAG_CODES[i]} />
                    {c.name}
                  </span>
                </th>
                <td className="px-5 py-4">{c.language}</td>
                <td className="px-5 py-4 text-muted">{c.requirements}</td>
                <td className="px-5 py-4 text-muted">{c.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Telefon: kartochkalar */}
      <ul className="grid gap-3 md:hidden">
        {countries.map((c, i) => (
          <li key={c.name} className="card p-5">
            <p className="mb-3 flex items-center gap-3 font-heading text-[16px] font-bold">
              <Flag code={FLAG_CODES[i]} />
              {c.name}
            </p>
            <dl className="grid gap-2 text-[14px]">
              <div>
                <dt className="text-muted">{L("language")}</dt>
                <dd className="font-medium">{c.language}</dd>
              </div>
              <div>
                <dt className="text-muted">{L("requirements")}</dt>
                <dd>{c.requirements}</dd>
              </div>
              <div>
                <dt className="text-muted">{L("trades")}</dt>
                <dd>{c.trades}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex max-w-3xl items-start gap-2 text-[14px] text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        {t("international.note")}
      </p>
    </Section>
  );
}
