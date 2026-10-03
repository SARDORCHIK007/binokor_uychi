interface Props {
  className?: string;
}

/**
 * Logotip belgisi: amber kvadrat ichida "U" harfi, o'ng tomoni minorali kranga
 * aylanadi (strela va ilgak). Nom (Uychi) va soha (qurilish) bitta belgida.
 */
export function LogoMark({ className = "h-9 w-9" }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="#F5A623" />
      {/* Kran strelasi */}
      <path d="M9 12.5H39" stroke="#070D18" strokeWidth="4" strokeLinecap="round" />
      {/* U harfi — o'ng ustuni kran minorasi */}
      <path
        d="M16 19v9.5a8 8 0 0 0 16 0V12.5"
        fill="none"
        stroke="#070D18"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Tros va ilgak */}
      <path d="M20 12.5v4.5" stroke="#070D18" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="18" y="17" width="4" height="3.2" rx="0.8" fill="#070D18" />
    </svg>
  );
}

export function Logo({ className = "" }: Props) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-heading text-[17px] font-extrabold leading-none tracking-[-0.01em] text-white">
        UYCHI<span className="text-amber"> BUILDERS</span>
      </span>
    </span>
  );
}
