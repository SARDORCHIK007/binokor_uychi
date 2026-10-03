/**
 * Soddalashtirilgan bayroqlar (inline SVG). Emoji bayroqlar Windows'da
 * ko'rinmagani uchun ishlatiladi. Tartib: DE, JP, KR, SG, AE.
 */
const FLAGS: Record<string, JSX.Element> = {
  de: (
    <>
      <rect width="30" height="20" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </>
  ),
  jp: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </>
  ),
  kr: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="5" fill="#0047A0" />
      <path d="M10 10a5 5 0 0 1 10 0a2.5 2.5 0 0 1-5 0a2.5 2.5 0 0 0-5 0z" fill="#CD2E3A" />
      <g stroke="#000" strokeWidth="1.1">
        <path d="M4 4.5l3-2M4.8 5.7l3-2M5.6 6.9l3-2" />
        <path d="M22 2.5l3 2M21.2 3.7l3 2M20.4 4.9l3 2" />
        <path d="M4 15.5l3 2M4.8 14.3l3 2M5.6 13.1l3 2" />
        <path d="M22 17.5l3-2M21.2 16.3l3-2M20.4 15.1l3-2" />
      </g>
    </>
  ),
  sg: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="10" fill="#EF3340" />
      <circle cx="7" cy="5" r="3.4" fill="#fff" />
      <circle cx="8.3" cy="5" r="3.1" fill="#EF3340" />
      <g fill="#fff">
        <circle cx="10.6" cy="3" r="0.6" />
        <circle cx="12.4" cy="4.2" r="0.6" />
        <circle cx="11.7" cy="6.3" r="0.6" />
        <circle cx="9.5" cy="6.3" r="0.6" />
        <circle cx="8.8" cy="4.2" r="0.6" />
      </g>
    </>
  ),
  ae: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#00732F" />
      <rect y="13.33" width="30" height="6.67" fill="#000" />
      <rect width="8" height="20" fill="#FF0000" />
    </>
  ),
};

export const FLAG_CODES = ["de", "jp", "kr", "sg", "ae"] as const;

export function Flag({ code, className = "h-5 w-[30px]" }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/20 ${className}`} aria-hidden="true">
      {FLAGS[code]}
    </svg>
  );
}
