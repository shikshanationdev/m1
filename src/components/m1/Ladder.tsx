"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ladder as levels } from "@/data/m1";
import { pad, rovingKey } from "@/lib/m1";
import { useSwap } from "@/lib/hooks";

const N = levels.length;
const desc = (l: (typeof levels)[number]) =>
  l.detail
    ? `${l.detail} Level One runs for twelve months: a weekly faculty lecture, live Q&A, and a half-day workshop every quarter.`
    : "A future level of the M1 ladder. Programme details for this level have not been announced yet.";

/* 06 M1Ladder — seven-level ladder */
export default function Ladder() {
  const [cur, setCur] = useState(0);
  const [shown, out] = useSwap(cur);
  const l = levels[shown];
  const stairs = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const base = useRef<SVGPathElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const steps = useRef<(HTMLButtonElement | null)[]>([]);
  const geo = useRef<{ segs: number[]; total: number }>({ segs: [], total: 0 });
  const curRef = useRef(0);

  const applyLit = useCallback(() => {
    const { segs, total } = geo.current;
    if (segs.length && lit.current) lit.current.style.strokeDashoffset = String(total - segs[curRef.current]);
  }, []);

  useEffect(() => {
    const draw = () => {
      if (!stairs.current || !svgRef.current || getComputedStyle(svgRef.current).display === "none") return;
      const R = stairs.current.getBoundingClientRect();
      const pts = steps.current.map((s) => {
        const r = s!.getBoundingClientRect();
        return [r.left - R.left, r.top - R.top + r.height / 2];
      });
      let d = `M${pts[0][0]} ${pts[0][1]}`, total = 0;
      const segs = [0];
      for (let k = 1; k < pts.length; k++) {
        d += ` V${pts[k][1]} H${pts[k][0]}`;
        total += Math.abs(pts[k][1] - pts[k - 1][1]) + Math.abs(pts[k][0] - pts[k - 1][0]);
        segs.push(total);
      }
      base.current!.setAttribute("d", d);
      lit.current!.setAttribute("d", d);
      lit.current!.style.strokeDasharray = `${total} ${total}`;
      geo.current = { segs, total };
      applyLit();
    };
    const ro = new ResizeObserver(draw);
    if (stairs.current) ro.observe(stairs.current);
    draw();
    return () => ro.disconnect();
  }, [applyLit]);

  const select = (i: number, focus?: boolean) => {
    const j = (i + N) % N;
    curRef.current = j;
    setCur(j);
    applyLit();
    if (focus) steps.current[j]?.focus();
  };

  return (
    <div className="ladder-grid" id="ladder-ui">
      <div className="stairs" ref={stairs} role="group" aria-label="The seven M1 levels" onKeyDown={(e) => rovingKey(e, cur, N, (j) => select(j, true), "vertical")}>
        <svg className="path" aria-hidden="true" ref={svgRef}>
          <path className="st-base" ref={base} />
          <path className="st-lit" ref={lit} />
        </svg>
        {levels.map((lv, i) => (
          <Fragment key={lv.n}>
            <button
              ref={(el) => { steps.current[i] = el; }}
              className={`step${lv.current ? " current" : ""}${i <= cur ? " is-lit" : ""}`}
              type="button"
              style={{ "--i": i } as React.CSSProperties}
              aria-pressed={i === cur}
              aria-controls="ladder-detail"
              onClick={() => select(i)}
            >
              <span className="num">{lv.n}</span>
              <span className="name">{lv.name}</span>
              <span className="tag">{lv.current ? "Starting point" : "Future level"}</span>
            </button>
            <div className="step-inline" style={{ "--i": i } as React.CSSProperties} hidden={i !== cur}>
              {desc(lv)}
              {lv.current && <> <a className="inline-link" href="#level-one">See the program</a></>}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="ladder-detail" id="ladder-detail" aria-live="polite">
        <div className="ld-bg" aria-hidden="true">{l.n}</div>
        <div className={`ld-swap${out ? " is-out" : ""}`}>
          <p className="ld-meta">Level {l.n} of {pad(N)} {l.current && <span className="status-pill">Starting point</span>}</p>
          <h3 className="ld-name">{l.name}</h3>
          <p className="ld-text">{desc(l)}</p>
          <a className="btn btn-ghost ld-link" href="#level-one" hidden={!l.current}>
            See the Level One program <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
