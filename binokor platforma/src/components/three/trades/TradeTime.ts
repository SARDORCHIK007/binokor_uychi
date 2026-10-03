import { createContext, useContext, type MutableRefObject } from "react";

/** Kasb sahnasining sikli: animatsiya ~4.5 s, har 6 soniyada qaytariladi. */
export const CYCLE = 6;

/** Sikl ichidagi vaqt (sekund, 0..CYCLE). `useFrame` ichida o'qiladi. */
export const TradeTimeContext = createContext<MutableRefObject<number> | null>(null);

export function useTradeTime(): MutableRefObject<number> {
  const ref = useContext(TradeTimeContext);
  if (!ref) throw new Error("useTradeTime faqat TradeStage ichida ishlatiladi");
  return ref;
}
