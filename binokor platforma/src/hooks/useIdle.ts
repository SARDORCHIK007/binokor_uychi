import { useEffect, useState } from "react";

/**
 * Sahifa yuklanib, brauzer bo'shaganda (`requestIdleCallback`) `true` bo'ladi.
 * Foydalanuvchi scroll / sensor bilan harakat qilsa — darhol. Og'ir 3D bo'laklarni
 * birinchi ko'rinishdan keyin yuklash uchun.
 */
export function useIdle(timeout = 2500): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (idle) return;
    let idleId: number | undefined;
    let timer: number | undefined;
    const done = () => setIdle(true);

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(done, { timeout });
      } else {
        timer = window.setTimeout(done, 200);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));

    return () => {
      window.removeEventListener("load", schedule);
      events.forEach((e) => window.removeEventListener(e, done));
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [idle, timeout]);

  return idle;
}
