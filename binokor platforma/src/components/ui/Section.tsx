import type { ReactNode } from "react";

/**
 * base — shaffof fon + chizma to'ri (orqadagi tarmoq animatsiyasi ko'rinadi);
 * raised — yarim shaffof biroz ochroq yuza. Kartochkalar har doim solid.
 */
export type SectionTone = "base" | "raised";

const TONES: Record<SectionTone, string> = {
  base: "grid-lines",
  raised: "bg-deep/75 border-y border-line",
};

interface Props {
  id: string;
  tone: SectionTone;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

export function Section({ id, tone, children, className = "", labelledBy }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={`relative py-20 text-white lg:py-32 ${TONES[tone]} ${className}`}
    >
      <div className="container-content">{children}</div>
    </section>
  );
}
