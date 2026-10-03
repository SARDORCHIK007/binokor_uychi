import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Hover'da amber chegara */
  interactive?: boolean;
  className?: string;
}

/** Solid to'q kartochka: ingichka chegara, shaffoflik va blur yo'q. */
export function Card({ children, interactive = false, className = "" }: Props) {
  return (
    <div className={`card-dark p-6 ${interactive ? "card-dark-hover" : ""} ${className}`}>{children}</div>
  );
}
