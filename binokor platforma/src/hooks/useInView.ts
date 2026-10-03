import { useEffect, useRef, useState, type RefObject } from "react";

interface Options {
  rootMargin?: string;
  once?: boolean;
}

/** Element ekranga chiqqanini kuzatadi. 3D sahnalar uchun default 200px oldindan. */
export function useInView<T extends Element>({
  rootMargin = "200px",
  once = false,
}: Options = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
