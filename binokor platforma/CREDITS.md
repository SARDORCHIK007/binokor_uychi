# Manbalar va litsenziyalar

Saytdagi barcha 3D obyektlar (bino, kran, ishchi, asboblar, globus) **kodda**, three.js
geometriyalaridan yasalgan. Tashqi 3D modellar, stock-rasmlar va sun'iy intellekt
yaratgan odam yuzlari ishlatilmagan.

## Shriftlar

| Shrift | Mualliflar | Litsenziya |
|---|---|---|
| Inter | The Inter Project Authors | SIL Open Font License 1.1 — `public/fonts/LICENSE-Inter.txt` |
| Montserrat | The Montserrat Project Authors | SIL Open Font License 1.1 — `public/fonts/LICENSE-Montserrat.txt` |

Shrift fayllari saytning o'zidan yuklanadi (`public/fonts/`), tashqi xizmatga so'rov yuborilmaydi.

## Xarita ma'lumotlari (globus)

- **Natural Earth** — quruqlik chegaralari, 1:110m. Public domain. <https://www.naturalearthdata.com/>
- **world-atlas** (ISC litsenziyasi) — Natural Earth ma'lumotining TopoJSON shakli.

Bu ma'lumotlardan faqat bir martalik skript (`scripts/generate-land-mask.mjs`) orqali
1.6 KB'lik quruqlik maskasi yaratilgan (`src/components/three/globe/landMask.ts`).
Saytning o'ziga xarita fayli kirmaydi.

## Logotiplar va ramzlar

| Fayl | Egasi |
|---|---|
| `public/partners/gerb.webp` | O'zbekiston Respublikasining Davlat gerbi — davlat ramzi. Hokimliklarni ko'rsatish uchun qonunchilikka muvofiq ishlatiladi |
| `public/partners/namdtu.webp` | Namangan davlat texnika universiteti |
| `public/partners/itpark.webp` | IT Park Uzbekistan |

Logotiplar tegishli tashkilotlarga tegishli va faqat hamkorlikni ko'rsatish uchun joylashtirilgan.
Bayroqlar (`src/components/ui/Flag.tsx`) — soddalashtirilgan SVG chizmalar.

## Kutubxonalar

| Kutubxona | Versiya | Litsenziya |
|---|---|---|
| React, React DOM | 18.3 | MIT |
| three.js | 0.169 | MIT |
| @react-three/fiber | 8.18 | MIT |
| @react-three/drei | 9.122 | MIT |
| GSAP (ScrollTrigger) | 3.15 | GSAP Standard "No Charge" License — <https://gsap.com/standard-license> |
| Framer Motion | 11.18 | MIT |
| i18next, react-i18next | 26 / 17 | MIT |
| Lucide (ikonkalar) | 1.50 | ISC |
| Tailwind CSS | 3.4 | MIT |
| Vite | 5.4 | MIT |
| TypeScript | 5.9 | Apache-2.0 |
| topojson-client, d3-geo, world-atlas (faqat skript uchun) | — | ISC |
