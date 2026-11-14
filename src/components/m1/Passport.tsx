"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { passport as PP } from "@/data/m1";
import { Icon, M1Mark, reduced } from "@/lib/m1";
import { useSwipe } from "@/lib/hooks";

type Side = "left" | "right";
type PageName = "cover" | "inside" | "identity" | "credentials" | "development" | "opportunities" | "stamps" | "blank";

function Rosette({ n = 36, rx = 46, ry = 15 }) {
  return (
    <svg className="ros" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth=".25" aria-hidden="true">
      {Array.from({ length: n }, (_, k) => <ellipse key={k} cx="50" cy="50" rx={rx} ry={ry} transform={`rotate(${((180 / n) * k).toFixed(2)} 50 50)`} />)}
      <circle cx="50" cy="50" r="47" strokeWidth=".4" />
      <circle cx="50" cy="50" r="14" strokeWidth=".4" />
    </svg>
  );
}
const Guilloche = () => (
  <svg className="gl" viewBox="0 0 400 560" preserveAspectRatio="none" fill="none" stroke="rgba(200,167,126,.45)" strokeWidth=".5" aria-hidden="true">
    {Array.from({ length: 22 }, (_, k) => <path key={k} d={`M0 ${20 + k * 22} C 80 ${k * 22 - 10} 160 ${k * 22 + 50} 240 ${20 + k * 22} S 400 ${k * 22 - 10} 480 ${20 + k * 22}`} />)}
  </svg>
);
const PgFoot = ({ n }: { n: string }) => <p className="pg-foot" aria-hidden="true"><span>M1 Professional Passport</span><b>{n}</b></p>;
const Wm = () => <M1Mark kind="solid" className="wm-mark" />;
const KV = ({ rows, style }: { rows: [string, string][]; style?: React.CSSProperties }) => (
  <dl className="kv" style={style}>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
);

function IdPhoto() {
  if (PP.holder.photo) return <img src={PP.holder.photo} alt={PP.holder.alt} style={{ objectPosition: PP.holder.pos || "50% 30%" }} />;
  return (
    <svg viewBox="0 0 78 100" aria-hidden="true">
      <defs><linearGradient id="idg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B9946C" /><stop offset="1" stopColor="#7E5B3C" /></linearGradient></defs>
      <circle cx="39" cy="38" r="15" fill="url(#idg)" />
      <path d="M10 100 C 12 74 24 64 39 64 C 54 64 66 74 68 100 Z" fill="url(#idg)" />
    </svg>
  );
}

function Page({ name, side, onCover }: { name: PageName; side: Side; onCover?: () => void }) {
  switch (name) {
    case "cover":
      return (
        <div className="cover" role="button" tabIndex={-1} aria-label="Open the M1 passport" onClick={(e) => { e.stopPropagation(); onCover?.(); }}>
          <div><p className="cover-t">M<span className="one">1</span> Professional<br />Passport</p></div>
          <M1Mark kind="solid" className="cover-mark" />
          <div><p className="cover-s">Global Medical Education</p></div>
          <span className="cover-chip" aria-hidden="true" />
        </div>
      );
    case "inside":
      return (
        <div className="cover-inside">
          <div className="endpaper"><Rosette /><p><b>M1 Professional Passport</b>A single record of its holder&apos;s learning, credentials and professional milestones across the M1 ecosystem.</p></div>
        </div>
      );
    case "identity":
      return (
        <div className={`paper ${side}`}>
          <Guilloche /><Wm />
          <div className="pg-top"><span>M1 Professional Passport</span><span>Identity</span></div>
          <div className="id-grid">
            <div className="id-photo"><IdPhoto /><span className="holo" aria-hidden="true" /></div>
            <KV rows={PP.identity.slice(0, 4)} />
          </div>
          <KV rows={PP.identity.slice(4)} style={{ marginTop: "1em", gridTemplateColumns: "1fr 1fr", display: "grid" }} />
          <p className="mrz" aria-hidden="true">{PP.mrz[0]}<br />{PP.mrz[1]}</p>
        </div>
      );
    case "credentials":
      return (
        <div className={`paper ${side}`}>
          <Guilloche /><Wm />
          <div className="pg-top"><span>Credentials</span><span>Page 02</span></div>
          <p className="pg-title">Qualifications</p>
          <table className="tbl"><thead><tr><th>Record</th><th>Entry</th></tr></thead>
            <tbody>{PP.qualifications.map((r) => <tr key={r[0]}><td>{r[0]}</td><td className="m">{r[1]}</td></tr>)}</tbody></table>
          <p className="pg-sec">Professional registration</p>
          <KV rows={PP.license} style={{ marginTop: ".6em" }} />
          <div className="verify"><i aria-hidden="true" />Credential verification through M1 is planned and not yet active.</div>
          <PgFoot n="02" />
        </div>
      );
    case "development":
      return (
        <div className={`paper ${side}`}>
          <Guilloche /><Wm />
          <div className="pg-top"><span>Professional development</span><span>Page 03</span></div>
          <p className="pg-title">CME &amp; learning record</p>
          <table className="tbl"><thead><tr><th>Activity</th><th>When</th><th>Record</th></tr></thead>
            <tbody>{PP.development.map((r, k) => <tr key={k}><td>{r[0]}</td><td className="m">{r[1]}</td><td className="m">{r[2]}</td></tr>)}</tbody></table>
          <p className="pg-sec">Milestone</p>
          <p style={{ position: "relative", marginTop: ".4em", color: "var(--taupe)" }}>Level One · Foundations — in progress</p>
          <PgFoot n="03" />
        </div>
      );
    case "opportunities": {
      const icons = [Icon.route, Icon.flask, Icon.globe, Icon.people];
      return (
        <div className={`paper ${side}`}>
          <Guilloche /><Wm />
          <div className="pg-top"><span>Global opportunities</span><span>Page 04</span></div>
          <p className="pg-title">Where your record can take you</p>
          <div className="opp">{PP.opportunities.map(([t, s], k) => <div key={t}>{icons[k]()}<p><b>{t}</b><span>{s}</span></p></div>)}</div>
          <p className="pg-sec" style={{ marginTop: "1.4em" }}>Opening with the M1 platform</p>
          <PgFoot n="04" />
        </div>
      );
    }
    case "stamps":
      return (
        <div className={`paper ${side}`}>
          <Guilloche />
          <div className="pg-top"><span>Endorsements</span><span>Page 05</span></div>
          <p className="pg-title">Programme stamps</p>
          <div className="stamps">
            {PP.stamps.map((s, k) => (
              <span key={k} className={`ink ${s.shape}`} style={{ color: s.color, left: s.x + "%", top: s.y + "%", transform: `rotate(${s.r}deg)` }}>
                {s.lines.map((l, j) => <span key={j}>{l}</span>)}
              </span>
            ))}
          </div>
          <PgFoot n="05" />
        </div>
      );
    default:
      return <div className={`paper ${side}`}><Guilloche /></div>;
  }
}

const LAYOUTS = {
  spread: {
    defs: [["cover", "inside"], ["identity", "credentials"], ["development", "opportunities"]] as [PageName, PageName][],
    labels: ["Cover", "Identity", "Credentials · Development", "Opportunities · Endorsements"],
  },
  single: {
    defs: [["cover", "inside"], ["identity", "blank"], ["credentials", "blank"], ["development", "blank"], ["opportunities", "blank"]] as [PageName, PageName][],
    labels: ["Cover", "Identity", "Credentials", "Development", "Opportunities", "Endorsements"],
  },
};

/* 08 PassportExperience — 3D booklet that opens when scrolled into view */
export function PassportViewer() {
  const [mode, setMode] = useState<"spread" | "single">("spread");
  const [s, setS] = useState(0);
  const [turning, setTurning] = useState<Record<number, boolean>>({});
  const [isIn, setIsIn] = useState(false);
  const viewer = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const sRef = useRef(0);
  const modeRef = useRef<"spread" | "single">("spread");
  const prevS = useRef(0);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const autoOpened = useRef(false);
  const { defs, labels } = LAYOUTS[mode];
  const n = defs.length;

  const go = useCallback((k: number) => {
    k = Math.max(0, Math.min(n, k));
    if (k === sRef.current) return;
    if (reduced()) viewer.current?.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    const from = sRef.current;
    sRef.current = k;
    /* leaves whose side changes lift above the rest while they turn */
    const lo = Math.min(from, k), hi = Math.max(from, k);
    for (let i = lo; i < hi; i++) {
      setTurning((t) => ({ ...t, [i]: true }));
      clearTimeout(timers.current[i]);
      timers.current[i] = setTimeout(() => setTurning((t) => ({ ...t, [i]: false })), reduced() ? 30 : 1150);
    }
    prevS.current = from;
    setS(k);
  }, [n]);

  /* page layout: two-page spreads on wide screens, single pages below 900px */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const build = () => {
      const m = window.innerWidth < 900 ? "single" : "spread";
      if (m === modeRef.current) return;
      modeRef.current = m;
      viewer.current?.classList.add("pp-instant");
      sRef.current = 0;
      setS(0);
      setTurning({});
      setMode(m);
      requestAnimationFrame(() => requestAnimationFrame(() => viewer.current?.classList.remove("pp-instant")));
    };
    build();
    const rz = () => { clearTimeout(t); t = setTimeout(build, 150); };
    window.addEventListener("resize", rz);
    return () => { window.removeEventListener("resize", rz); clearTimeout(t); };
  }, []);

  /* rise in once, then open by itself when well inside the screen */
  useEffect(() => {
    const v = viewer.current;
    if (!v) return;
    const io1 = new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { setIsIn(true); o.disconnect(); } }, { threshold: 0.25 });
    let openT: ReturnType<typeof setTimeout>;
    const io2 = new IntersectionObserver(([en]) => {
      clearTimeout(openT);
      if (en.isIntersecting && !autoOpened.current && sRef.current === 0)
        openT = setTimeout(() => { if (!autoOpened.current && sRef.current === 0) { autoOpened.current = true; go(1); } }, reduced() ? 0 : 450);
    }, { threshold: 0.6 });
    io1.observe(v);
    io2.observe(v);
    return () => { io1.disconnect(); io2.disconnect(); clearTimeout(openT); };
  }, [go]);

  const swipe = useSwipe((d) => go(sRef.current + d));

  const focusAfter = (sel: string) => requestAnimationFrame(() => controls.current?.querySelector<HTMLElement>(sel)?.focus());
  const act = (a: string) => {
    autoOpened.current = true;
    if (a === "open") { go(1); focusAfter('[data-act="next"]'); }
    else if (a === "next") go(s + 1);
    else if (a === "prev") go(s - 1);
    else if (a === "close") { go(0); focusAfter('[data-act="open"]'); }
  };

  return (
    <>
      <div
        className={`pp-viewer${mode === "single" ? " viewer-single" : ""}${isIn ? " is-in" : ""}`}
        id="pp-viewer"
        ref={viewer}
        data-open={String(s > 0)}
        tabIndex={0}
        role="group"
        aria-label="M1 passport booklet, concept preview with a fictional holder. Use the arrow keys to turn pages."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(s + 1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); go(s - 1); }
          else if (e.key === "Escape") go(0);
          else if ((e.key === "Enter" || e.key === " ") && s === 0) { e.preventDefault(); go(1); }
        }}
        {...swipe.handlers}
      >
        <div className="pp-shadow" aria-hidden="true" />
        <div
          className="book"
          onAnimationEnd={(e) => { if (e.target === e.currentTarget) setIsIn(false); }}
          onClick={(e) => {
            if (swipe.swiped.current || s === 0) return;
            const r = e.currentTarget.getBoundingClientRect();
            const right = e.clientX > r.left + r.width / 2;
            if (mode === "single" || right) go(s + 1); else go(s - 1);
          }}
        >
          <div className="book-backL" aria-hidden="true" />
          <div className="book-back" aria-hidden="true" />
          <div className="stack-r" aria-hidden="true" />
          <div className="base-page" style={{ position: "absolute", top: 0, width: mode === "single" ? "100%" : "50%", height: "100%", left: mode === "single" ? 0 : "50%" }}>
            <Page name="stamps" side="right" />
          </div>
          {defs.map(([front, back], i) => {
            const turned = i < s;
            const z = turning[i] ? 40 : turned ? 10 + i : 30 - i;
            return (
              <div key={`${mode}-${i}`} className={`leaf${turned ? " turned" : ""}${turning[i] ? " turning" : ""}`} data-i={i} style={{ "--z": z } as React.CSSProperties}>
                <div className="face front"><Page name={front} side="right" onCover={() => { autoOpened.current = true; if (sRef.current === 0) go(1); }} /></div>
                <div className="face back"><Page name={back} side="left" /></div>
              </div>
            );
          })}
          <div className="spine-stitch" aria-hidden="true" />
        </div>
      </div>
      <div className="pp-controls" id="pp-controls" ref={controls}>
        {s === 0 ? (
          <>
            <button className="btn btn-primary" type="button" data-act="open" onClick={() => act("open")}>Open passport <span className="arr" aria-hidden="true">→</span></button>
            <span className="pp-ind">M1 Passport<b>Cover</b></span>
          </>
        ) : (
          <>
            <button className="icon-btn" type="button" data-act="prev" aria-label="Previous page" onClick={() => act("prev")}>{Icon.prev()}</button>
            <span className="pp-ind" aria-live="polite">{mode === "spread" ? "Spread" : "Page"} {s} of {n}<b>{labels[s]}</b></span>
            <button className="icon-btn" type="button" data-act="next" aria-label="Next page" disabled={s >= n} onClick={() => act("next")}>{Icon.next()}</button>
            <button className="btn btn-ghost btn-sm" type="button" data-act="close" onClick={() => act("close")}>{Icon.close(16)} Close</button>
          </>
        )}
      </div>
    </>
  );
}

export function PassportText() {
  return (
    <details className="pp-text" id="pp-text">
      <summary>Read the passport pages as text</summary>
      <div className="pp-text-body">
        <div><h3>Identity</h3><ul>{PP.identity.map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul></div>
        <div><h3>Credentials</h3><ul>{PP.qualifications.map((r) => <li key={r[0]}>{r[0]}: {r[1]}</li>)}{PP.license.map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul></div>
        <div><h3>Professional development</h3><ul>{PP.development.map((r, k) => <li key={k}>{r[0]} — {r[1]}, {r[2].toLowerCase()}</li>)}</ul></div>
        <div><h3>Global opportunities</h3><ul>{PP.opportunities.map(([t, d]) => <li key={t}>{t}: {d}</li>)}</ul></div>
        <p className="pp-text-note">Concept preview: the passport holder and every record shown are fictional.</p>
      </div>
    </details>
  );
}
