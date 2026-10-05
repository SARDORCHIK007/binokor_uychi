import { fileURLToPath } from "node:url";

// Tailwind sozlamasi har doim shu papkadan o'qiladi (qaysi papkadan ishga tushirilsa ham)
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL("./tailwind.config.js", import.meta.url)) },
    autoprefixer: {},
  },
};
