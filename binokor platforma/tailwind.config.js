import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url)).replace(/\\/g, "/");

/** @type {import('tailwindcss').Config} */
export default {
  content: [here("./index.html"), here("./src/**/*.{ts,tsx}")],
  theme: {
    screens: {
      xs: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        // Rasmiy palitra (davlat va universitet saytlari uslubi)
        brand: {
          DEFAULT: "#0F4C81", // asosiy ko'k
          600: "#0D426F",
          700: "#0A365C", // header usti paneli, footer
          50: "#EEF4FA",
          100: "#DCE8F4",
        },
        gold: { DEFAULT: "#B8862B", 50: "#FBF5EA" }, // kichik urg'ular
        ink: "#0F172A", // asosiy matn
        muted: "#475569", // ikkinchi darajali matn (oq fonda kontrast ~7.5:1)
        line: "#E2E8F0", // chegara chiziqlari
        soft: "#F5F7FA", // och kulrang bo'limlar
        white: "#FFFFFF",
      },
      fontFamily: {
        heading: ["Montserrat", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["30px", { lineHeight: "1.2", fontWeight: "700" }],
        "h1-lg": ["44px", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.25", fontWeight: "700" }],
        "h2-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["18px", { lineHeight: "1.35", fontWeight: "700" }],
        body: ["16px", { lineHeight: "1.65" }],
      },
      borderRadius: { card: "12px" },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.04)",
        "card-hover": "0 6px 18px rgba(15,23,42,.08)",
      },
      maxWidth: { content: "1200px" },
    },
  },
  plugins: [],
};
