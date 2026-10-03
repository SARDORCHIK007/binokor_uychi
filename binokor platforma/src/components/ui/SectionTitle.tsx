import { m } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  id: string;
  children: string;
  intro?: string;
  /** Sarlavha ustidagi kichik belgi, masalan "01 — Loyiha" */
  eyebrow?: string;
  center?: boolean;
}

export function SectionTitle({ id, children, intro, eyebrow, center = false }: Props) {
  const reduced = useReducedMotion();
  return (
    <div className={`mb-12 max-w-3xl lg:mb-16 ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-5 ${center ? "justify-center" : ""}`}>{eyebrow}</p>}
      <m.h2
        id={id}
        className="text-h2 text-white lg:text-h2-lg"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </m.h2>
      {intro && <p className="mt-5 max-w-2xl text-muted lg:text-[19px]">{intro}</p>}
    </div>
  );
}
