import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Faqat `npm run dev` da: brauzerdan olingan 3D sahna rasmini `public/` ga saqlaydi
 * (fallback rasmlar va OG rasmni qayta yaratish uchun). Production build'ga kirmaydi.
 */
function devCapture(): Plugin {
  return {
    name: "dev-capture",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__capture", (req, res) => {
        const file = new URL(req.url ?? "", "http://localhost").searchParams.get("file") ?? "";
        if (req.method !== "POST" || !/^[\w/-]+\.(webp|jpg|png)$/.test(file)) {
          res.statusCode = 400;
          res.end("bad request");
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          const out = path.resolve(__dirname, "public", file);
          fs.mkdirSync(path.dirname(out), { recursive: true });
          fs.writeFileSync(out, Buffer.concat(chunks));
          res.end("ok");
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devCapture()],
  build: {
    target: "es2020",
    // three.js bo'lagi (~820 KB, gzip ~220 KB) faqat 3D kerak bo'lganda kechiktirib yuklanadi
    chunkSizeWarningLimit: 900,
  },
});
