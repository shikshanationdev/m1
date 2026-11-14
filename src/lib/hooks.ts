"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { reduced } from "./m1";

/** horizontal swipe on touch / pen / mouse drag; cb(+1) = next */
export function useSwipe(cb: (dir: 1 | -1) => void) {
  const st = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  return {
    swiped,
    handlers: {
      onPointerDown: (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        st.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      },
      onPointerUp: (e: PointerEvent) => {
        const s = st.current;
        if (!s || e.pointerId !== s.id) return;
        st.current = null;
        const dx = e.clientX - s.x, dy = e.clientY - s.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          swiped.current = true;
          setTimeout(() => (swiped.current = false), 50);
          cbRef.current(dx < 0 ? 1 : -1);
        }
      },
      onPointerCancel: () => (st.current = null),
    },
  };
}

/** text that fades out, swaps, and fades back in when `value` changes */
export function useSwap<T>(value: T): [T, boolean] {
  const [shown, setShown] = useState(value);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (Object.is(value, shown)) return;
    if (reduced()) {
      setShown(value);
      return;
    }
    setOut(true);
    const t = setTimeout(() => {
      setShown(value);
      requestAnimationFrame(() => setOut(false));
    }, 220);
    return () => clearTimeout(t);
  }, [value]);
  return [shown, out];
}

