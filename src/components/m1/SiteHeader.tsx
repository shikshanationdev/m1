"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/data/m1";
import { M1Mark, M1Text, pad } from "@/lib/m1";

/* 01 HeaderNavigation — sticky nav, mobile menu, scroll-spy */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 1180 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    const opts = { rootMargin: "-45% 0px -50% 0px" };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.isIntersecting && setCurrent(en.target.id));
    }, opts);
    nav.forEach((n) => {
      const s = document.getElementById(n.id);
      if (s) io.observe(s);
    });
    const clear = new IntersectionObserver((en) => {
      if (en.some((x) => x.isIntersecting)) setCurrent(null);
    }, opts);
    ["hero", "register"].forEach((id) => {
      const s = document.getElementById(id);
      if (s) clear.observe(s);
    });
    return () => {
      io.disconnect();
      clear.disconnect();
    };
  }, []);

  return (
    <>
      <header className="site-nav" id="site-nav" data-scrolled={String(scrolled || open)}>
        <div className="wrap nav-inner">
          <a className="brand" href="#hero" aria-label="M One Global Medical Education — back to top">
            <M1Mark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">M One</span>
              <span className="brand-sub">Global Medical Education</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} aria-current={current === n.id ? "true" : "false"}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn-primary btn-sm nav-cta" href="#register">
            Join M1
          </a>
          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>
      <div className="mobile-menu" id="mobile-menu" hidden={!open} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <div className="wrap">
          <ul>
            {nav.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>
                  <span className="ml">
                    <M1Text text={n.label} />
                  </span>
                  <span>{pad(i + 2)}</span>
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary" href="#register">
            Join the M1 Community <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </>
  );
}
