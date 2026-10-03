import { useEffect, useRef } from "react";
import { useIdle } from "../../hooks/useIdle";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDeviceTier } from "../../hooks/useWebGLSupport";

/** Tugun turi: oddiy nuqta, chizmadagi "+" o'lchov belgisi yoki amber urg'u */
type Kind = "dot" | "cross" | "accent";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: Kind;
  r: number;
}

const LINK_DIST = 150; // shu masofadan yaqin tugunlar chiziq bilan bog'lanadi
const FPS = 30;
const SPEED = 0.12; // px / kadr — juda sekin

/**
 * Butun sayt orqasidagi sezilar-sezilmas "tarmoq" foni: nuqtalar sekin suzadi,
 * yaqinlashganda ingichka chiziqlar bilan bog'lanadi (qurilish chizmasi + AI ruhi).
 * Oddiy 2D canvas, 30 kadr/s; yorliq yashirin bo'lsa to'xtaydi; reduced-motion va
 * zaif qurilmalarda bir marta, harakatsiz chiziladi.
 */
export function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const idle = useIdle();
  const animate = !reduced && tier === "full";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !idle) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let last = 0;
    let scrollShift = 0;
    let seededW = 0;

    const seedNodes = () => {
      // Zichlik: taxminan har 22 000 px² ga bitta tugun, 30..90 oralig'ida
      const count = Math.max(30, Math.min(90, Math.round((w * h) / 22000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const a = Math.random() * Math.PI * 2;
        const kind: Kind = i % 11 === 0 ? "accent" : i % 4 === 0 ? "cross" : "dot";
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(a) * SPEED * (0.4 + Math.random()),
          vy: Math.sin(a) * SPEED * (0.4 + Math.random()),
          kind,
          r: kind === "accent" ? 1.8 : 1.2 + Math.random() * 0.6,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Faqat kenglik sezilarli o'zgarganda qayta joylash (mobil manzil satri balandlikni o'zgartiradi)
      if (nodes.length === 0 || Math.abs(w - seededW) > 40) {
        seedNodes();
        seededW = w;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Scroll bilan juda yengil parallaks (chuqurlik hissi)
      const oy = -scrollShift;

      // Chiziqlar
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ay = (((a.y + oy) % h) + h) % h;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const by = (((b.y + oy) % h) + h) % h;
          const dx = a.x - b.x;
          const dy = ay - by;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          const accent = a.kind === "accent" || b.kind === "accent";
          ctx.strokeStyle = accent ? `rgba(245,166,35,${0.22 * t})` : `rgba(154,166,184,${0.16 * t})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, ay);
          ctx.lineTo(b.x, by);
          ctx.stroke();
        }
      }

      // Tugunlar
      for (const n of nodes) {
        const y = (((n.y + oy) % h) + h) % h;
        if (n.kind === "cross") {
          ctx.strokeStyle = "rgba(190,200,215,0.32)";
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(n.x - 3, y);
          ctx.lineTo(n.x + 3, y);
          ctx.moveTo(n.x, y - 3);
          ctx.lineTo(n.x, y + 3);
          ctx.stroke();
        } else {
          ctx.fillStyle = n.kind === "accent" ? "rgba(245,166,35,0.55)" : "rgba(200,210,225,0.3)";
          ctx.beginPath();
          ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 1000 / FPS) return;
      last = now;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }
      scrollShift = window.scrollY * 0.08;
      draw();
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && animate) raf = requestAnimationFrame(step);
    };
    const onResize = () => {
      resize();
      if (!animate) draw();
    };

    resize();
    draw();
    if (animate) raf = requestAnimationFrame(step);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [idle, animate]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-1000"
      style={{ opacity: idle ? 1 : 0 }}
    />
  );
}
