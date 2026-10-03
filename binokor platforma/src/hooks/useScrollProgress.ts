import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Element bo'ylab scroll progress (0 → 1), GSAP ScrollTrigger `scrub: 1` bilan
 * silliqlangan. React render qilmaydi — qiymat ref'da, `useFrame` ichida o'qiladi.
 * `reduced` bo'lsa progress doim 1 (yakuniy holat).
 */
export function useScrollProgress(
  triggerRef: RefObject<HTMLElement>,
  reduced: boolean,
  { start = "top top", end = "bottom bottom" }: { start?: string; end?: string } = {},
): MutableRefObject<number> {
  const progress = useRef(reduced ? 1 : 0);

  useEffect(() => {
    const el = triggerRef.current;
    if (reduced || !el) {
      progress.current = 1;
      return;
    }
    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: { trigger: el, start, end, scrub: 1 },
      onUpdate: () => {
        progress.current = proxy.p;
      },
    });
    if (import.meta.env.DEV) {
      (window as unknown as { __progress?: Record<string, MutableRefObject<number>> }).__progress = {
        ...(window as unknown as { __progress?: Record<string, MutableRefObject<number>> }).__progress,
        [el.id || "scene"]: progress,
      };
      (window as unknown as { __st?: unknown }).__st = tween.scrollTrigger;
    }
    // Shriftlar va lazy bloklar yuklangach o'lchamlar o'zgaradi
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [triggerRef, reduced, start, end]);

  return progress;
}
