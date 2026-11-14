"use client";

import { useEffect } from "react";
import { reduced } from "@/lib/m1";

/* transform-only reveal, so content is always visible at rest */
export default function Reveal() {
  useEffect(() => {
    if (reduced()) {
      /* stop the logo sheen sweep for reduced-motion visitors */
      document.querySelectorAll("animate, animateTransform").forEach((a) => a.remove());
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".sec-head, .vision-quote, .vm, .feat, .year, .mod-head, .pp-copy, .reg-copy, .form-panel"));
    const io = new IntersectionObserver(
      (en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.remove("is-pending"); io.unobserve(x.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("rv", "is-pending"); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);
  return null;
}
