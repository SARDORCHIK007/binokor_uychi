interface Props {
  id: string;
  children: string;
  intro?: string;
  /** Sarlavha ustidagi kichik belgi */
  kicker?: string;
}

/** Bo'lim sarlavhasi: chap tomonda ko'k chiziq, ostida qisqa izoh. */
export function SectionTitle({ id, children, intro, kicker }: Props) {
  return (
    <div className="mb-8 max-w-3xl lg:mb-10">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 id={id} className="border-l-4 border-brand pl-4 text-h2 lg:text-h2-lg">
        {children}
      </h2>
      {intro && <p className="mt-4 text-muted lg:text-[17px]">{intro}</p>}
    </div>
  );
}
