"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { careerStages as stages, type CareerStage } from "@/data/m1";
import { Icon, SHAPE, pad, reduced, rovingKey } from "@/lib/m1";
import { useSwap, useSwipe } from "@/lib/hooks";

const N = stages.length;
const STEP_VH = 46;
const P = "M60 170 C 250 170 350 134 480 118 C 640 98 720 88 840 68 C 960 48 1040 34 1140 26";

/* plate tones for the ivory band: warm light to deep bronze (stage 06 is the dark "leaders" plate) */
const STAGE_TONE = [
  { bg: ["#FFF8EF", "#F0D8BE"], arch: ["#F8D2AC", "#D9A273"], tri: ["#FCE8D3", "#E7C29C"], line: "rgba(153,112,71,.34)", ink: "#67452E", flare: 0.9 },
  { bg: ["#FCF2E6", "#E8D0B5"], arch: ["#F0C196", "#C78F60"], tri: ["#F7DDC1", "#DDB088"], line: "rgba(153,112,71,.34)", ink: "#5A3B27", flare: 0.85 },
  { bg: ["#F8EBDC", "#E0C4A4"], arch: ["#FF9B5E", "#E0581F"], tri: ["#F1D3B2", "#D2A479"], line: "rgba(153,112,71,.36)", ink: "#FFF6EA", flare: 0.75 },
  { bg: ["#F2E2CF", "#D6B793"], arch: ["#E0581F", "#A23C1C"], tri: ["#E8C8A4", "#C5976A"], line: "rgba(120,86,56,.36)", ink: "#FFF4E6", flare: 0.65 },
  { bg: ["#EAD6BF", "#C9A47F"], arch: ["#A23C1C", "#5E1F0C"], tri: ["#DAB58D", "#B1855A"], line: "rgba(103,69,46,.38)", ink: "#FBEBD6", flare: 0.55 },
  { bg: ["#3C1A10", "#140805"], arch: ["#FF7229", "#A23C1C"], tri: ["#5E2A18", "#381A10"], line: "rgba(255,170,120,.3)", ink: "#260F09", flare: 0.35 },
];

function laurel() {
  const R = 42, cx = 60, cy = 64;
  const Pt = (t: number) => [cx + R * Math.cos((t * Math.PI) / 180), cy + R * Math.sin((t * Math.PI) / 180)].map((v) => +v.toFixed(2));
  const [ax, ay] = Pt(95), [bx, by] = Pt(232);
  const leaves: React.ReactNode[] = [];
  for (let t = 108; t <= 228; t += 20) {
    const [x, y] = Pt(t), rot = t + 120;
    leaves.push(
      <g key={t}>
        <ellipse cx={x} cy={y} rx="9" ry="3.4" transform={`rotate(${rot} ${x} ${y})`} />
        <ellipse cx={120 - x} cy={y} rx="9" ry="3.4" transform={`rotate(${180 - rot} ${120 - x} ${y})`} />
      </g>,
    );
  }
  return (
    <>
      <path d={`M${ax} ${ay} A${R} ${R} 0 0 1 ${bx} ${by}`} />
      <path d={`M${120 - ax} ${ay} A${R} ${R} 0 0 0 ${120 - bx} ${by}`} />
      {leaves}
      <circle cx="60" cy="58" r="12" />
      <path d="M60 50 l2.4 5 5.4.6-4 3.7 1.1 5.3-4.9-2.7-4.9 2.7 1.1-5.3-4-3.7 5.4-.6z" />
    </>
  );
}

const STAGE_ICON: Record<CareerStage["icon"], React.ReactNode> = {
  book: (<><path d="M18 44 Q40 34 60 44 Q80 34 102 44 V96 Q80 86 60 96 Q40 86 18 96 Z" /><path d="M60 44 V96" /><path d="M28 24 H44 L50 12 L58 34 L64 22 H92" /></>),
  stethoscope: (<><path d="M36 12 V38 Q36 62 58 62 Q80 62 80 38 V12" /><circle cx="36" cy="10" r="3.5" /><circle cx="80" cy="10" r="3.5" /><path d="M58 62 V78 Q58 102 80 102 Q98 102 98 84 V74" /><circle cx="98" cy="64" r="10" /><circle cx="98" cy="64" r="4" /></>),
  clipboard: (<><rect x="28" y="18" width="64" height="88" rx="7" /><rect x="44" y="10" width="32" height="16" rx="4" /><path d="M40 48 L46 54 L56 42" /><path d="M64 49 H82" /><path d="M40 70 L46 76 L56 64" /><path d="M64 71 H82" /><path d="M42 92 H78" /></>),
  monitor: (<><rect x="12" y="24" width="96" height="64" rx="8" /><path d="M48 88 L42 104 H78 L72 88" /><path d="M22 58 H44 L50 42 L58 76 L65 50 L71 58 H98" /></>),
  staff: (<><path d="M60 8 V112" /><path d="M60 26 C 38 32 82 46 60 54 C 38 62 82 76 60 84 C 46 90 54 98 60 98" /><circle cx="60" cy="26" r="3" /><path d="M48 112 H72" /></>),
  laurel: laurel(),
};

const shape = (kind: "tri" | "arch", x: number, y: number, w: number, h: number, props: React.SVGProps<SVGPathElement>, key?: number) => (
  <path key={key} d={SHAPE[kind]} transform={`translate(${x} ${y}) scale(${w} ${h})`} vectorEffect="non-scaling-stroke" {...props} />
);

function StagePlate({ st, i }: { st: CareerStage; i: number }) {
  const t = STAGE_TONE[i], id = "sp" + i;
  if (st.photo)
    return <img className="eco-photo" src={st.photo} alt={st.alt || st.role} style={{ objectPosition: st.pos || "50% 35%" }} decoding="async" />;
  const echo: React.ReactNode[] = [];
  for (let k = 26; k >= 1; k--) {
    const o = +(1 - k / 30).toFixed(2);
    echo.push(shape("tri", 126 - k * 3.2, 196 - k * 2.4, 236, 246, { fill: "none", stroke: t.line, strokeWidth: 1, opacity: o }, k));
    echo.push(shape("arch", 300 + k * 3.4, 112 - k * 2.6, 196, 330, { fill: "none", stroke: t.line, strokeWidth: 1, opacity: o }, 100 + k));
  }
  return (
    <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${st.title} — ${st.role}`}>
      <defs>
        <radialGradient id={`${id}b`} cx="72%" cy="20%" r="95%"><stop offset="0" stopColor={t.bg[0]} /><stop offset="1" stopColor={t.bg[1]} /></radialGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t.arch[0]} /><stop offset="1" stopColor={t.arch[1]} /></linearGradient>
        <linearGradient id={`${id}t`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.tri[0]} /><stop offset="1" stopColor={t.tri[1]} /></linearGradient>
        <radialGradient id={`${id}f`}><stop offset="0" stopColor="#FFF3E2" stopOpacity={t.flare} /><stop offset="1" stopColor="#FFF3E2" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="600" height="480" fill={`url(#${id}b)`} />
      <circle cx="470" cy="70" r="200" fill={`url(#${id}f)`} />
      <g>{echo}</g>
      <path d="M40 444 H560" stroke={t.line} strokeWidth="1" />
      {shape("tri", 126, 196, 236, 246, { fill: `url(#${id}t)` })}
      {shape("arch", 300, 112, 196, 330, { fill: `url(#${id}a)` })}
      <g transform="translate(336 222) scale(1.02)" fill="none" stroke={t.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {STAGE_ICON[st.icon]}
      </g>
    </svg>
  );
}

/* 03 CareerEcosystem — six-stage continuum */
export default function CareerEcosystem() {
  const [cur, setCur] = useState(0);
  const [mode, setMode] = useState<"tap" | "scroll">("tap");
  const [nodePos, setNodePos] = useState<{ left: string; top: string }[] | null>(null);
  const [shownIdx, out] = useSwap(cur);
  const s = stages[shownIdx];

  const root = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const L = useRef(0);
  const curRef = useRef(0);
  const modeRef = useRef<"tap" | "scroll">("tap");
  const lockUntil = useRef(0);
  const holdUntil = useRef(0);
  const flags = useRef({ inView: false, hover: false, focusIn: false });

  const setLine = useCallback((f: number) => {
    const v = Math.max(0, Math.min(1, f));
    if (lit.current) lit.current.style.strokeDashoffset = String(L.current - L.current * v);
    stepsRef.current?.style.setProperty("--f", String(v));
  }, []);

  const select = useCallback((i: number) => {
    i = (i + N) % N;
    if (i === curRef.current) return;
    curRef.current = i;
    setCur(i);
    if (modeRef.current !== "scroll") setLine(i / (N - 1));
  }, [setLine]);

  const stickyTop = () => (sticky.current ? parseFloat(getComputedStyle(sticky.current).top) || 0 : 0);
  const range = () => (root.current && sticky.current ? root.current.offsetHeight - sticky.current.offsetHeight : 1);

  const onScroll = useCallback(() => {
    if (modeRef.current !== "scroll" || !root.current) return;
    const p = Math.max(0, Math.min(1, (stickyTop() - root.current.getBoundingClientRect().top) / Math.max(1, range())));
    setLine((p * N - 0.5) / (N - 1));
    root.current.style.setProperty("--eco-p", p.toFixed(3));
    if (performance.now() > lockUntil.current) select(Math.min(N - 1, Math.floor(p * N)));
  }, [select, setLine]);

  const go = useCallback((i: number, focus?: boolean) => {
    i = (i + N) % N;
    if (modeRef.current === "scroll" && root.current) {
      const top = window.scrollY + root.current.getBoundingClientRect().top - stickyTop();
      lockUntil.current = performance.now() + (reduced() ? 50 : 1000);
      select(i);
      setLine(i / (N - 1));
      window.scrollTo({ top: top + (range() * (i + 0.5)) / N, behavior: reduced() ? "auto" : "smooth" });
    } else {
      select(i);
      holdUntil.current = performance.now() + 12000;
    }
    if (focus) {
      const useNodes = modeRef.current === "scroll" || (trackRef.current && getComputedStyle(trackRef.current).display !== "none");
      (useNodes ? nodeRefs : stepRefs).current[i]?.focus({ preventScroll: true });
    }
  }, [select, setLine]);

  /* measure the track once, place the nodes on it */
  useLayoutEffect(() => {
    const p = lit.current;
    if (!p) return;
    L.current = p.getTotalLength();
    p.style.strokeDasharray = `${L.current} ${L.current}`;
    setNodePos(stages.map((_, i) => {
      const pt = p.getPointAtLength((L.current * i) / (N - 1));
      return { left: pt.x / 12 + "%", top: pt.y / 2 + "%" };
    }));
    setLine(0);
  }, [setLine]);

  /* layout mode, scroll and resize */
  useEffect(() => {
    let raf = 0;
    const layout = () => {
      const m = window.innerWidth >= 1025 && window.innerHeight >= 740 ? "scroll" : "tap";
      modeRef.current = m;
      setMode(m);
      if (root.current) root.current.style.height = m === "scroll" ? `calc(100vh - var(--nav-h) + ${N * STEP_VH}vh)` : "";
      if (m === "scroll") onScroll();
      else setLine(curRef.current / (N - 1));
    };
    const sc = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; onScroll(); }); };
    const rz = () => requestAnimationFrame(layout);
    layout();
    window.addEventListener("scroll", sc, { passive: true });
    window.addEventListener("resize", rz);
    return () => { window.removeEventListener("scroll", sc); window.removeEventListener("resize", rz); cancelAnimationFrame(raf); };
  }, [onScroll, setLine]);

  /* gentle autoplay in tap mode while visible */
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => (flags.current.inView = en.isIntersecting), { threshold: 0.4 });
    if (root.current) io.observe(root.current);
    const t = setInterval(() => {
      const f = flags.current;
      if (modeRef.current !== "tap" || !f.inView || f.hover || f.focusIn || document.hidden || reduced() || performance.now() < holdUntil.current) return;
      select(curRef.current + 1);
    }, 6500);
    return () => { io.disconnect(); clearInterval(t); };
  }, [select]);

  const swipe = useSwipe((d) => modeRef.current === "tap" && go(curRef.current + d));

  const tabProps = (i: number) => ({
    role: "tab" as const,
    "aria-selected": i === cur,
    "aria-controls": "eco-panel",
    tabIndex: i === cur ? 0 : -1,
    onClick: () => go(i),
  });

  return (
    <div
      className="eco"
      id="eco"
      ref={root}
      data-mode={mode}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") flags.current.hover = true; }}
      onPointerLeave={() => (flags.current.hover = false)}
      onPointerDownCapture={(e) => { if (e.pointerType !== "mouse") holdUntil.current = performance.now() + 12000; }}
      onFocus={() => (flags.current.focusIn = true)}
      onBlur={() => (flags.current.focusIn = false)}
    >
      <div className="eco-sticky" ref={sticky}>
        <div className="eco-track" ref={trackRef}>
          <svg viewBox="0 0 1200 200" aria-hidden="true">
            <path className="eco-base" d={P} />
            <path className="eco-lit" d={P} ref={lit} />
          </svg>
          <div className="eco-nodes" role="tablist" aria-label="Career stages" onKeyDown={(e) => rovingKey(e, cur, N, (j) => go(j, true))}>
            {stages.map((st, i) => (
              <button
                key={st.key}
                type="button"
                className={`eco-node${i < cur ? " is-past" : ""}`}
                id={`eco-tab-${i}`}
                ref={(el) => { nodeRefs.current[i] = el; }}
                style={nodePos ? nodePos[i] : { visibility: "hidden" }}
                {...tabProps(i)}
              >
                <span className="dot">{st.n}</span>
                <span className="t">
                  {st.title}
                  <span className="s">{st.role}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="eco-steps" role="tablist" aria-label="Career stages" ref={stepsRef} onKeyDown={(e) => rovingKey(e, cur, N, (j) => go(j, true))}>
          <i />
          {stages.map((st, i) => (
            <button
              key={st.key}
              type="button"
              className={i < cur ? "is-past" : undefined}
              aria-label={`${st.title}: ${st.role}`}
              ref={(el) => { stepRefs.current[i] = el; }}
              {...tabProps(i)}
            >
              {st.n}
            </button>
          ))}
        </div>
        <div className="eco-panel" id="eco-panel" role="tabpanel" aria-labelledby={`eco-tab-${cur}`} {...swipe.handlers}>
          <div className="eco-info">
            <div className={`eco-swap${out ? " is-out" : ""}`} aria-live="polite">
              <div className="eco-num" aria-hidden="true">{s.n}</div>
              <p className="eyebrow eco-chip">{s.chip}</p>
              <h3 className="eco-title">{s.title}</h3>
              <p className="eco-role">{s.role}</p>
              <p className="eco-text">{s.text}</p>
            </div>
            <div className="eco-ctrl">
              <button className="icon-btn" type="button" aria-label="Previous stage" onClick={() => go(curRef.current - 1)}>{Icon.prev()}</button>
              <span className="eco-count" aria-hidden="true"><b>{stages[cur].n}</b> / {pad(N)}</span>
              <span className="progress" aria-hidden="true" style={{ "--p": ((cur + 1) / N) * 100 + "%" } as React.CSSProperties}><i /></span>
              <button className="icon-btn" type="button" aria-label="Next stage" onClick={() => go(curRef.current + 1)}>{Icon.next()}</button>
            </div>
            <p className="eco-hint" aria-hidden="true">
              <span className="wheel"><i /></span>
              <span className="hint-scroll">Keep scrolling to move through all six stages</span>
              <span className="hint-auto">Stages advance automatically · tap to choose</span>
            </p>
          </div>
          <div className="eco-visual">
            {stages.map((st, i) => (
              <div key={st.key} className={`layer${i === cur ? " is-on" : ""}`} aria-hidden={i !== cur}>
                <StagePlate st={st} i={i} />
                <span className="plate-cap">Stage {st.n} · {st.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
