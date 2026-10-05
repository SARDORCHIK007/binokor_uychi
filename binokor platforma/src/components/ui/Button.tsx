import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "light";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-[15px] font-medium transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-600",
  outline: "border border-brand text-brand hover:bg-brand-50",
  /** To'q ko'k fon ustida */
  light: "bg-white text-brand-700 hover:bg-brand-50",
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
