/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      colors: {
        // To'q premium palitra
        ink: "#070D18", // asosiy fon
        deep: "#0A1220", // ko'tarilgan bo'limlar foni
        surface: { DEFAULT: "#0D1626", 2: "#132036" }, // kartochkalar, ko'tarilgan bo'limlar
        line: { DEFAULT: "#1D2A42", strong: "#2A3A57" }, // chegara chiziqlari
        muted: "#9AA6B8", // ikkinchi darajali matn (ink ustida kontrast ~7.9:1)
        navy: { DEFAULT: "#0B1F3A", 700: "#13305A" },
        amber: { DEFAULT: "#F5A623", 600: "#D98C0A", soft: "#2A2012" },
        concrete: "#8A939E",
        paper: "#F2F4F7",
        white: "#FFFFFF",
        brick: "#B5562F",
        steel: "#5F6B78",
        wood: "#A9743F",
      },
      fontFamily: {
        heading: ["Montserrat", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["40px", { lineHeight: "1.05", fontWeight: "800", letterSpacing: "-0.02em" }],
        "h1-lg": ["84px", { lineHeight: "0.98", fontWeight: "800", letterSpacing: "-0.03em" }],
        h2: ["30px", { lineHeight: "1.15", fontWeight: "800", letterSpacing: "-0.015em" }],
        "h2-lg": ["52px", { lineHeight: "1.08", fontWeight: "800", letterSpacing: "-0.025em" }],
        h3: ["20px", { lineHeight: "1.3", fontWeight: "700" }],
        "h3-lg": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        body: ["16px", { lineHeight: "1.65" }],
        "body-lg": ["18px", { lineHeight: "1.65" }],
      },
      borderRadius: { card: "20px" },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,.04) inset, 0 12px 32px rgba(0,0,0,.35)",
        "card-hover": "0 1px 0 rgba(255,255,255,.06) inset, 0 18px 44px rgba(0,0,0,.5)",
      },
      maxWidth: { content: "1200px" },
    },
  },
  plugins: [],
};
