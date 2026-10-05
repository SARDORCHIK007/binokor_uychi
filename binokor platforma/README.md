# NamDTU Qurilish fakulteti (Uychi tumani) — veb-sayt

Namangan davlat texnika universiteti Qurilish fakultetining sayti va uning asosiy dasturi
**"Uychidan dunyoga — professional ustalar"** taqdimoti. Rasmiy uslub: oq fon, ko'k rang,
animatsiyalarsiz. Ikki til (o'zbek / ingliz), telefonga moslashgan.

**Sayt manzili:** https://uychi-builders.vercel.app
Sayt Vercel'da joylashgan va GitHub'ga ulangan — GitHub'ga yuklangan har bir o'zgarishdan
keyin 1–2 daqiqada avtomatik yangilanadi.

---

## 1. O'zgartirishni saytga chiqarish

1. Faylni o'zgartiring (pastdagi bo'limlarda qaysi fayl nima uchunligi yozilgan).
2. GitHub Desktop'da **Summary** ga qisqa izoh yozing → **Commit to main** → **Push origin**.
3. 1–2 daqiqadan keyin sayt yangilanadi (Vercel → Deployments bo'limida holat **Ready**).

Kompyuterda oldindan ko'rish (bir marta `npm install`, keyin):

```bash
npm run dev
```

---

## 2. Matnlarni almashtirish

Barcha matnlar: `src/locales/uz.json` (o'zbekcha) va `src/locales/en.json` (inglizcha).
Faqat qo'shtirnoq ichidagi o'ng tomondagi matnni o'zgartiring; qatorlar oxiridagi vergullarni
o'chirmang. Bir tilda o'zgartirsangiz, ikkinchisida ham o'zgartiring.

| Saytdagi joy | Fayldagi kalit |
|---|---|
| Fakultet nomi, universitet nomi | `brand` |
| Menyu | `nav` |
| Bosh banner va "Asosiy ma'lumotlar" | `hero` |
| Tezkor havolalar | `quick` |
| Fakultet haqida | `about`, `campus.intro`, `campus.facts` |
| Nega bu dastur kerak? | `problem` |
| Dastur (5 bosqich) | `model` |
| Yo'nalishlar (8 kasb va ularning oynasi) | `trades` |
| Xalqaro hamkorlik jadvali | `international` |
| Dastur nimani beradi | `results.benefits` |
| Bosqichlar | `roadmap` |
| Hamkorlar | `partners` |
| Aloqa | `contact` |
| Sahifa pasti | `footer` |

Sahifa sarlavhasi va Google / Telegram'da ko'rinadigan tavsif — `index.html`.

---

## 3. Aloqa ma'lumotlari va murojaat formasi

Fayl: `src/config.ts`

```ts
phone: "",            // masalan "+998 69 123 45 67"
email: "",            // masalan "qurilish@namdtu.uz"
telegram: "",         // masalan "https://t.me/namdtu_qurilish"
address: "Namangan viloyati, Uychi tumani",
mapUrl: "https://maps.app.goo.gl/o4LfDyiHXKDjnzjh7",
CONTACT_ENDPOINT: "", // murojaat formasi manzili
PHASE_YEARS: ["1-bosqich", "2-bosqich", "3-bosqich"],
```

- **Bo'sh qoldirilgan maydon saytda ko'rinmaydi.** Telefon, email yoki Telegram to'ldirilsa,
  ular tepadagi panelda, Aloqa bo'limida va sahifa pastida avtomatik paydo bo'ladi.
- **Murojaat formasi** faqat `CONTACT_ENDPOINT` berilganda chiqadi (masalan, Formspree yoki
  Telegram bot manzili). Bo'sh bo'lsa, forma ko'rsatilmaydi.
- `PHASE_YEARS` — bosqichlar yorlig'i, masalan `["2026–2027", "2027–2028", "2028–2030"]`.

---

## 4. Logotip va fotosuratlar

Fayl: `src/data/partners.ts`

- **Hamkor logotiplari** — `public/partners/`. `PARTNER_LOGOS` ro'yxatida `null` turgan joyda
  logotip o'rniga qisqartma (masalan "NamDTU") ko'rsatiladi. Rasmiy logotip faylini
  `public/partners/` ga qo'yib, `null` o'rniga `{ src: "/partners/fayl.webp", w: 360, h: 360 }`
  yozing (`w`, `h` — rasmning haqiqiy o'lchami).
- **Fakultet binosi fotosurati** — `CAMPUS_PHOTO` (`public/campus/namdtu-qurilish-1600.webp`
  va `-800.webp`). Almashtirish uchun shu nomdagi fayllarni 1600 va 800 px kenglikda almashtiring;
  `null` qilinsa, foto o'rniga ko'k panel chiqadi.
- **Sayt logotipi** (header va footer) — NamDTU logotipi, `public/partners/namdtu.webp`
  (`src/components/layout/Logo.tsx`). Brauzer belgisi — `public/favicon-64.png` va
  `public/apple-touch-icon.png`.
- **Bosh sahifa fon videosi** — `public/video/hero.mp4` (ovozsiz, takrorlanadi) va
  `public/video/hero-poster.webp` (video yuklanguncha ko'rinadigan kadr). Almashtirish uchun
  shu nomdagi fayllarni almashtiring; video hajmi 10 MB dan oshmagani ma'qul.
- **"Zamonaviy qurilish kasblari" suratlari** — `public/gallery/` (welding, concrete, site, lift.webp;
  fon videosidan olingan kadrlar). Sarlavhalari — `gallery.items`. Haqiqiy suratlar bo'lsa, shu
  nomdagi fayllarni almashtiring.
- **Asosiy raqamlar** (bosh ekran ostidagi oq panel) — `stats.items` (uz.json / en.json).
- **Telegram'da havola rasmi** — `public/og-image.jpg` (1200×630).

Hozir ko'rsatilmayotgan, lekin saqlab qo'yilgan materiallar (tasdiqlangach yoqiladi):
`campus.facts` dagi diplom haqidagi qator.

---

## 5. Domen

Hozirgi manzil Vercel'ning bepul `uychi-builders.vercel.app` manzili. O'z domeningiz bo'lsa
(masalan `qurilish.namdtu.uz`), Vercel → **Domains → Add** orqali ulanadi. Shundan keyin
`index.html` dagi `og:url`, `og:image`, `twitter:image`, `canonical` hamda
`public/robots.txt` va `public/sitemap.xml` dagi manzilni almashtiring.

---

## 6. Dasturchilar uchun

Vite 5, React 18, TypeScript (`strict`), Tailwind CSS 3, i18next, lucide-react. 3D va animatsiya
kutubxonalari yo'q; birinchi yuklanadigan JS ~82 KB (gzip), butun sayt ~1 MB.

```
src/
  config.ts              aloqa, xarita, forma manzili, bosqich yorliqlari, menyu
  data/partners.ts       hamkor logotiplari, fakultet fotosurati
  locales/uz.json, en.json
  components/layout/     Header (xizmat paneli + menyu), Footer, Logo, LangSwitch, MobileMenu
  components/ui/         Section, SectionTitle, Button, Modal, Flag
  sections/              Hero, QuickLinks, About, Program, Trades, International,
                         Benefits, Roadmap, Partners, Contact
```

`npm run build` → `dist/`. Tailwind sozlamasi `postcss.config.js` orqali har doim shu papkadan
o'qiladi.

Manbalar va litsenziyalar: [CREDITS.md](CREDITS.md).
