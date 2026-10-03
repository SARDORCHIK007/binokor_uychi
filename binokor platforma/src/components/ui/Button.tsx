import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-heading text-[15px] font-bold transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-amber text-ink shadow-[0_10px_30px_-10px_rgba(245,166,35,.6)] hover:bg-[#FFB840]",
  outline: "border border-line-strong bg-surface text-white hover:border-amber/60",
};

interface Common {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type BtnProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: LinkProps | BtnProps) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (typeof rest.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
