"use client";

import { useEffect, useRef, useState } from "react";
import { programFeatures, programStats } from "@/data/m1";
import { pad } from "@/lib/m1";
import { LevelPlate } from "./StaticSections";

/* 05 LevelOneProgram — program + 52-week calendar that fills on scroll */
export default function LevelOne() {
  const [w, setW] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const g = gridRef.current;
      if (!g) return;
      const r = g.getBoundingClientRect(), vh = window.innerHeight;
      const dist = Math.max(r.height, vh * 0.4);
      setW(Math.round(Math.max(0, Math.min(1, (vh * 0.92 - r.top) / dist)) * 52));
    };
    const sc = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", sc, { passive: true });
    window.addEventListener("resize", calc);
    return () => { window.removeEventListener("scroll", sc); window.removeEventListener("resize", calc); cancelAnimationFrame(raf); };
  }, []);

  const done = Math.floor(w / 13);

  return (
    <section className="level section theme-copper" id="level-one" aria-labelledby="level-title">
      <div className="wrap">
        <div className="level-grid">
          <LevelPlate />
          <div className="level-copy">
            <p className="eyebrow"><span className="idx">05</span>Level One — The Program</p>
            <h2 className="h2" id="level-title">A steady rhythm of teaching, <em>for one full year.</em></h2>
            <p className="lede">Level One is the entry point into M One&apos;s seven-level ecosystem — built to run for twelve months, with a light, sustainable weekly commitment.</p>
            <ol className="feat-list">
              {programFeatures.map((f) => (
                <li className="feat" key={f.n}>
                  <span className="feat-n" aria-hidden="true">{f.n}</span>
                  <div>
                    <h3>{f.title}{f.tag && <> <span className="status-pill">{f.tag}</span></>}</h3>
                    <p>{f.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="btn btn-primary" href="#register">Register Interest in Level One <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="year" id="year" style={{ "--yp": (w / 52).toFixed(3) } as React.CSSProperties}>
          <div className="year-head">
            <div>
              <p className="eyebrow" style={{ color: "var(--gold)" }}>The Level One year</p>
              <h3 className="year-title">Fifty-two weeks of teaching. A workshop every quarter.</h3>
              <p className="year-sub">Each marker is one weekly faculty lecture. The lecture calendar and topics are being confirmed with the founding faculty.</p>
            </div>
            <div className="year-stats">
              {programStats.map((s) => <div className="ystat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
            </div>
          </div>
          <div className="year-grid" ref={gridRef}>
            {[0, 1, 2, 3].map((q) => (
              <div key={q} className={`qtr${w > q * 13 && w <= (q + 1) * 13 ? " is-active" : ""}`}>
                <div className="qtr-h"><b>Q{q + 1}</b><span>Weeks {pad(q * 13 + 1)}–{pad(q * 13 + 13)}</span></div>
                <div className="weeks" aria-hidden="true">
                  {Array.from({ length: 13 }, (_, k) => {
                    const idx = q * 13 + k;
                    return <span key={k} className={`wk${idx < w - 1 ? " on" : ""}${idx === w - 1 ? " now" : ""}`} title={`Week ${idx + 1} · weekly faculty lecture`} />;
                  })}
                </div>
                <div className={`workshop${q < done ? " on" : ""}`}><i aria-hidden="true" />Half-day workshop</div>
              </div>
            ))}
          </div>
          <div className="year-foot">
            <div className="year-bar" aria-hidden="true"><i /></div>
            <p className="readout">
              {w ? (
                <>Week <b>{pad(w)}</b> of 52 · <b>{w}</b> lecture{w > 1 ? "s" : ""} · <b>{done}</b> of 4 workshops</>
              ) : (
                <>Week <b>00</b> of 52 · the year fills as you scroll</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
