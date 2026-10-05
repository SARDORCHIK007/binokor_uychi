import type { ReactNode } from "react";

/** white — oq fon; soft — och kulrang fon (bo'limlar navbatma-navbat) */
export type SectionTone = "white" | "soft";

interface Props {
  id: string;
  tone: SectionTone;
  children: ReactNode;
  className?: string;
}

export function Section({ id, tone, children, className = "" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-14 lg:py-20 ${tone === "soft" ? "bg-soft" : "bg-white"} ${className}`}
    >
      <div className="container-content">{children}</div>
    </section>
  );
}
