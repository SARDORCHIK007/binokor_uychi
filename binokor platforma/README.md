# UYCHI BUILDERS — veb-platforma

**Uychidan dunyoga — professional ustalar.**
Namangan viloyati, Uychi tumanida qurilish ustalarini tayyorlash va xalqaro bozorga chiqarish
loyihasining taqdimot sayti: 3D animatsiyalar, ikki til (o'zbek / ingliz), telefonda tez ishlaydi.

Sayt **statik** — server, ma'lumotlar bazasi yoki dasturlash tili kerak emas. Tayyor sayt
`dist` papkasidagi oddiy fayllardan iborat va istalgan hostingga yuklanadi.

---

## Mundarija

1. [Kompyuterda ishga tushirish](#1-kompyuterda-ishga-tushirish)
2. [Matnlarni almashtirish](#2-matnlarni-almashtirish)
3. [Telefon, email, manzil va forma](#3-telefon-email-manzil-va-forma)
4. [Raqamlarni almashtirish (Natijalar)](#4-raqamlarni-almashtirish-natijalar)
5. [Logotiplarni almashtirish](#5-logotiplarni-almashtirish)
6. [Hostingga joylash](#6-hostingga-joylash)
7. [Domen va ijtimoiy tarmoqlar uchun rasm](#7-domen-va-ijtimoiy-tarmoqlar-uchun-rasm)
8. [Sinov rejimlari](#8-sinov-rejimlari)
9. [Dasturchilar uchun](#9-dasturchilar-uchun)

---

## 1. Kompyuterda ishga tushirish

**Bir marta o'rnatiladi:** [Node.js](https://nodejs.org/) — "LTS" versiyasini yuklab, o'rnating.

So'ng loyiha papkasida terminal (Windows'da: papkada `Shift` + sichqonchaning o'ng tugmasi →
"Terminalda ochish") oching va quyidagilarni yozing:

```bash
npm install
```

```bash
npm run dev
```

Terminalda chiqqan manzilni (odatda `http://localhost:5173`) brauzerda oching. Fayllarni
o'zgartirib saqlasangiz, sahifa o'zi yangilanadi.

**Hostingga yuklash uchun tayyor sayt yasash:**

```bash
npm run build
```

Natija `dist` papkasida paydo bo'ladi (taxminan 2 MB). Uni tekshirib ko'rish:

```bash
npm run preview
```

---

## 2. Matnlarni almashtirish

Saytdagi **barcha matnlar** ikki faylda:

| Til | Fayl |
|---|---|
| O'zbekcha | `src/locales/uz.json` |
| Inglizcha | `src/locales/en.json` |

Faylni istalgan matn muharririda (masalan, Notepad++ yoki VS Code) oching. Har bir qator
`"kalit": "matn"` ko'rinishida. **Faqat o'ng tomondagi matnni** o'zgartiring:

```json
"title": "Nega bu loyiha kerak?",
```

Qoidalar (aks holda sayt ochilmay qoladi):

- Matn **qo'shtirnoq** `"` ichida bo'lishi kerak. Matn ichida qo'shtirnoq kerak bo'lsa — `\"` yozing.
- O'zbekcha apostrof (`o'`, `g'`, `ma'lumot`) bemalol ishlatiladi.
- Qatorlar oxiridagi **vergullarni** o'chirmang (eng oxirgi elementdan keyin vergul bo'lmaydi).
- Bir tilda o'zgartirsangiz, ikkinchi tilda ham o'zgartirishni unutmang.

Qaysi bo'lim qayerda:

| Saytdagi bo'lim | Fayldagi kalit |
|---|---|
| Menyu | `nav` |
| Bosh ekran (hero): tashabbuskor, maqsad, o'quv maskani | `hero` |
| Nega bu loyiha kerak? | `problem` |
| Ustadan — dunyo bozorigacha | `model` |
| O'quv maskani (manzil, bino, diplom) | `campus` |
| Kasblar (8 ta, modal oyna matni bilan) | `trades.items` |
| Uychidan dunyoga (davlatlar) | `international` |
| Kutilayotgan natijalar | `results` |
| Loyiha bosqichlari | `roadmap` |
| Hamkorlar (nomi va roli) | `partners` |
| Aloqa va forma | `contact` |
| Sahifa pasti | `footer` |
| "Xaritada ko'rish" va boshqa umumiy so'zlar | `common` |

> Sahifa sarlavhasi va Google'da ko'rinadigan tavsif `index.html` faylida (`<title>` va
> `description` qatorlari).

---

## 3. Telefon, email, manzil va forma

Fayl: **`src/config.ts`**

```ts
export const CONFIG = {
  phone: "+998 XX XXX XX XX",
  email: "info@example.uz",
  telegram: "https://t.me/",
  address: "Namangan viloyati, Uychi tumani",
  mapUrl: "https://maps.app.goo.gl/o4LfDyiHXKDjnzjh7",
  CONTACT_ENDPOINT: "",
  PHASE_YEARS: ["1-bosqich", "2-bosqich", "3-bosqich"],
};
```

- `phone`, `email`, `telegram`, `address` — "Aloqa" bo'limida ko'rinadi. Telegram uchun to'liq
  havola yozing, masalan `https://t.me/uychibuilders`.
- `mapUrl` — o'quv maskani (NamDTU Qurilish fakulteti, Uychi tumani) joylashuvi. "Xaritada ko'rish"
  tugmalari (bosh ekran, O'quv maskani, Aloqa) shu havolani yangi oynada ochadi. Google Maps'da
  joyni topib, "Ulashish" → "Havolani nusxalash" orqali olingan havolani qo'ying.
- `PHASE_YEARS` — "Loyiha bosqichlari"dagi yorliqlar. Masalan: `["2026", "2027", "2028–2030"]`.
  Standart `"1-bosqich"` ko'rinishida qolsa, ingliz tilida avtomatik `Phase 1` bo'lib chiqadi.
- `CONTACT_ENDPOINT` — forma ma'lumoti yuboriladigan manzil.
  - **Bo'sh bo'lsa:** forma "Xabaringiz qabul qilindi" deydi, lekin ma'lumot **hech qayerga
    yuborilmaydi** (sinov rejimi).
  - **Manzil yozilsa:** forma `{ name, organization, phone, message }` ma'lumotini JSON
    ko'rinishida `POST` qilib yuboradi. Bunga Formspree, Getform kabi xizmatlar yoki o'zingizning
    serveringiz mos keladi. Masalan: `CONTACT_ENDPOINT: "https://formspree.io/f/xxxxxxx"`.

---

## 4. Raqamlarni almashtirish (Natijalar)

Raqamlar fayli: **`src/sections/Results.tsx`**, fayl boshidagi `STATS` ro'yxati:

```ts
const STATS = [
  { value: 1000, suffix: "+", icon: HardHat },
  { value: 30, suffix: "+", icon: Wrench },
  ...
];
```

- `value` — raqam (sanagich 0 dan shu songacha sanaydi).
- `suffix` — raqamdan keyingi belgi (`"+"`, `"%"` yoki bo'sh `""`).

Raqam ostidagi yozuvlar esa `uz.json` / `en.json` dagi `results.stats` ro'yxatida — tartibi bir xil.

---

## 5. Logotiplarni almashtirish

Logotiplar papkasi: **`public/partners/`**

| Hamkor | Fayl |
|---|---|
| Namangan davlat texnika universiteti (**asosiy tashabbuskor**) | `namdtu.webp` |
| Namangan viloyati hokimligi | `gerb.webp` |
| Uychi tumani hokimligi | `gerb.webp` |
| IT Park Namangan filiali | `itpark.webp` |

**Eng oson yo'l:** yangi logotipni **xuddi shu nom bilan** saqlab, eskisining ustiga yozing.
Kod o'zgartirilmaydi.

Tavsiyalar:

- Format: `.webp` yoki `.png` (shaffof fonli bo'lsa yaxshi). Agar `.png` yoki `.svg` ishlatsangiz,
  nomi o'zgaradi — unda pastdagi faylda yo'lni ham almashtiring.
- O'lcham: balandligi **360 px** atrofida (saytda 120 px ko'rinadi, aniq ekranlar uchun 3 baravar zaxira).
- Hajmi 100 KB dan kichik bo'lsin. Rasmni kichraytirish uchun bepul <https://squoosh.app> qulay.

Fayl nomi yoki tartibni o'zgartirish kerak bo'lsa: `src/data/partners.ts` (`PARTNER_LOGOS`).
Tartib `uz.json` / `en.json` dagi `partners.list` bilan bir xil bo'lishi kerak. Ro'yxatdagi
birinchi tashkilot (`INITIATOR_INDEX = 0`) bosh ekranda va Hamkorlar bo'limida **asosiy
tashabbuskor** sifatida alohida ko'rsatiladi. Logotiplar bosh ekranning pastki panelida ham chiqadi.
Har bir qatorda `src` (fayl yo'li) va `w`, `h` (rasmning haqiqiy o'lchami, piksel) bor.

**O'quv maskani rasmi:** `public/campus/namdtu-qurilish-1600.webp` (katta ekran) va
`namdtu-qurilish-800.webp` (telefon). Almashtirganda ikkalasini ham bir xil nom bilan saqlang
(kengligi 1600 va 800 px).

**Saytning o'z logotipi** (uy va kran belgisi) — `src/components/layout/Logo.tsx`.
Brauzer yorlig'idagi belgi — `public/favicon.svg`.

---

## 6. Hostingga joylash

Avval `npm run build` buyrug'ini bajaring. **`dist` papkasining ichidagi hamma narsa** — bu tayyor sayt.

**A. Netlify (eng oson, bepul):**
<https://app.netlify.com/drop> sahifasini oching va `dist` papkasini sichqoncha bilan
sahifaga tashlang. Bir necha soniyada sayt manzili beriladi; keyin o'z domeningizni ulash mumkin.

**B. Oddiy hosting (cPanel, ISPmanager va h.k.):**
Fayl menejeri yoki FTP orqali `dist` papkasining **ichidagi** fayllarni `public_html` (yoki
`www`) papkasiga yuklang. `index.html` shu papkaning o'zida turishi kerak.

**C. Vercel / GitHub Pages:**
Loyihani GitHub'ga yuklang, xizmatda "Build command" — `npm run build`, "Output directory" —
`dist` deb ko'rsating.

> Sayt bitta sahifadan iborat, shuning uchun qo'shimcha server sozlamasi kerak emas.
> HTTPS (qulfcha belgisi) yoqilgan bo'lishi tavsiya etiladi — ko'pchilik hostinglarda bepul.

---

## 7. Domen va ijtimoiy tarmoqlar uchun rasm

Telegram, Facebook va boshqa tarmoqlarda havola ulashilganda chiqadigan rasm —
`public/og-image.jpg` (1200×630 px).

Domen ma'lum bo'lgach, `index.html` faylida `og-image.jpg` qatnashgan **ikki joyni** to'liq
manzil bilan almashtiring (tarmoqlar nisbiy manzilni tushunmaydi):

```html
<meta property="og:image" content="https://SIZNING-DOMEN.uz/og-image.jpg" />
<meta name="twitter:image" content="https://SIZNING-DOMEN.uz/og-image.jpg" />
```

---

## 8. Sinov rejimlari

Sayt manzili oxiriga quyidagilarni qo'shib, turli qurilmalardagi ko'rinishni tekshirish mumkin:

| Manzil | Nima ko'rsatadi |
|---|---|
| `?no3d` | 3D'siz, rasmlar bilan (WebGL yo'q yoki juda zaif qurilmadagi ko'rinish) |
| `?lite` | Yengil rejim: kasb kartochkalarida rasm, jonli 3D faqat modal oynada |
| `?reduced` | Harakat kamaytirilgan rejim: animatsiyalarsiz, bino tayyor holatda |

Masalan: `http://localhost:5173/?no3d`

Sayt bu rejimlarni o'zi ham tanlaydi:

- **WebGL yo'q yoki 2 yadroli protsessor** → rasmlar;
- **4 yadro yoki 4 GB xotiragacha** → yengil rejim;
- **tizimda "harakatni kamaytirish" yoqilgan** → animatsiyasiz.

---

## 9. Dasturchilar uchun

**Texnologiyalar:** Vite 5, React 18, TypeScript (`strict`), Tailwind CSS 3, three.js +
@react-three/fiber + drei, GSAP ScrollTrigger, Framer Motion (`LazyMotion`), i18next, lucide-react.

**Tuzilish:**

```
src/
  config.ts                 aloqa ma'lumotlari, CONTACT_ENDPOINT, bosqich yorliqlari
  i18n.ts, locales/         tarjimalar (til localStorage'da saqlanadi)
  hooks/                    useInView, useReducedMotion, useWebGLSupport (qurilma darajasi),
                            useScrollProgress (GSAP), useIdle, useIsMobile, useList
  components/layout/        Header, Footer, LangSwitch, MobileMenu, Logo
  components/ui/            Section, SectionTitle, Button, Card, Counter, Modal, Flag
  components/three/
    SceneCanvas.tsx         umumiy Canvas: yorug'lik, osmon aksi, soyalar, shader warmup
    Materials.ts, RBox.tsx  PBR materiallar, yumaloq qirrali geometriya
    anim.ts                 easing funksiyalari
    hero/                   timeline.ts (scroll ssenariysi), Building, Crane, Ground, Trees
    trades/                 Worker + 8 ta kasb sahnasi, TradeStage, TradeModalStage
    globe/                  GlobeScene, Arc, geo.ts, landMask.ts
  sections/                 Hero … Contact, TradeModal
scripts/generate-land-mask.mjs   globus quruqlik maskasini yaratadi (npm run generate:land-mask)
public/fallback/                 3D o'rniga ko'rsatiladigan rasmlar
```

**Ishlash tezligi:**

- Birinchi yuklanadigan JS taxminan 112 KB (gzip). three.js va har bir 3D sahna alohida
  bo'lak bo'lib, ekranga 200 px qolganda yuklanadi.
- Hero 3D sahifa ko'rsatilib bo'lgach (idle) yuklanadi.
- Shaderlar `compileAsync` bilan oldindan, asosiy oqimni bloklamasdan tayyorlanadi.
- Ekrandan chiqqan sahna to'xtaydi, uzoqlashgani o'chiriladi.
- Lighthouse (mobil): Performance 73–74, Accessibility 100, Best Practices 100, SEO 100, CLS 0.

**Fallback va OG rasmlarni qayta yaratish** (3D sahnalar o'zgartirilganda):
`npm run dev` rejimida `vite.config.ts` dagi `/__capture` yordamchisi brauzerdagi canvas rasmini
`public/` ga saqlaydi. Sahnalar `window.__gl[nom]` orqali ochiladi (faqat dev rejimida):

- `hero`, `trade-1…8`, `globe` — sahnalar;
- `window.__progress.hero.current = 1` — hero'ni tayyor holatga o'tkazadi;
- `window.__tradeFreeze = 4.2` — kasb sahnalarini shu soniyada to'xtatadi.

Production build'ga bu kod kirmaydi.

**TZ'dan farqlar (kelishilgan):**

| TZ bandi | Amalda | Sabab |
|---|---|---|
| 4.1, 4.3 — navy / paper / oq bo'limlar navbati, ranglar | To'q premium uslub: `ink` (#070D18) asosiy fon nozik chizma to'ri bilan, `deep` ko'tarilgan bo'limlar, chegarali solid to'q kartochkalar, amber urg'ular; hero — tungi sahna | Buyurtmachi qarori (zamonaviyroq dizayn). Ranglar `tailwind.config.js` da |
| 4.4 — low-poly, `flatShading` | Silliq stilizatsiya: PBR materiallar, yumaloq qirralar, osmon aksi, bo'g'imli ishchi, panjarali kran | Buyurtmachi qarori (realroq ko'rinish) |
| 4.4 — yorug'lik 0.5 / 1.2 | Osmon/yer nuri + quyosh + atrof aksi | Silliq uslubga mos realistik yorug'lik |
| 6.5 — bayroq emoji | SVG bayroqlar | Windows'da emoji bayroq harf bo'lib chiqadi |
| 6.1 — kran joylashuvi | Kran bino orqasida | Ko'tarilgan blok desktopda sarlavhani to'smasligi uchun |
| 6.8 — placeholder logotiplar | Haqiqiy logotiplar va Davlat gerbi | Buyurtmachi taqdim etdi |
| 5 — "Hero'dan tashqari lazy" | Hero ham kechiktirib yuklanadi | Birinchi ochilish tezroq |

Manbalar va litsenziyalar: [CREDITS.md](CREDITS.md).
