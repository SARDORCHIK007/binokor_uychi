import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Sinov uchun: manzilga `?reduced` qo'shilsa, harakat kamaytirilgan rejim yoqiladi. */
const forced =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("reduced");

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => forced || (typeof window !== "undefined" && window.matchMedia(QUERY).matches),
  );
  useEffect(() => {
    if (forced) return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
