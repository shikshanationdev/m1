"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { faculty as list, facultyNote, facultyRole, type Faculty } from "@/data/m1";
import { IMG, Icon, M1Mark, cropStyle, pad, rovingKey } from "@/lib/m1";
import { useSwap, useSwipe } from "@/lib/hooks";

const N = list.length;
const label = (f: Faculty) => f.name + (f.post ? ", " + f.post : "");
type Geom = { mobile: boolean; r: number; cx: number; cy: number; step: number; start: number; ts: number };

/* 07 CircularFacultySelector — faculty orbit */
export default function FacultyOrbit() {
  const [cur, setCur] = useState(0);
  const [G, setG] = useState<Geom | null>(null);
  const [orbitW, setOrbitW] = useState<string | undefined>();
  const [rot, setRot] = useState(0);
  const [shown, out] = useSwap(cur);
  const f = list[shown];
  const orbit = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const curRef = useRef(0);
  const rotRef = useRef(0);

  /* on mobile the ring turns so the selected face sits at the top */
  const rotFor = (g: Geom | null, i: number) => {
    if (!g?.mobile) return 0;
    const target = -i * g.step;
    const diff = ((((target - rotRef.current) % 360) + 540) % 360) - 180;
    rotRef.current += diff;
    return rotRef.current;
  };

  useEffect(() => {
    let raf = 0;
    const geom = () => {
      const o = orbit.current;
      if (!o) return;
      const mobile = window.innerWidth <= 860, W = o.clientWidth, H = o.clientHeight;
      let g: Geom;
      if (!mobile) {
        const gl = parseFloat(getComputedStyle(o).marginLeft) * -1 || 0;
        const r = Math.max(210, Math.min(330, H * 0.43));
        const cx = Math.round(0.46 * r), span = 212;
        setOrbitW(Math.round(cx + r + 64 - gl) + "px");
        g = { mobile, r, cx, cy: Math.round(H / 2), step: span / (N - 1), start: -span / 2, ts: r > 280 ? 74 : 64 };
      } else {
        setOrbitW(undefined);
        const r = Math.max(W * 1.15, 440), ts = 58;
        g = { mobile, r, cx: W / 2, cy: r + 60, step: (2 * Math.asin((ts + 20) / 2 / r) * 180) / Math.PI, start: -90, ts };
      }
      /* snap without travel after a layout change */
      o.classList.add("no-anim");
      setG(g);
      setRot(rotFor(g, curRef.current));
      requestAnimationFrame(() => requestAnimationFrame(() => o.classList.remove("no-anim")));
    };
    geom();
    const rz = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(geom); };
    window.addEventListener("resize", rz);
    return () => { window.removeEventListener("resize", rz); cancelAnimationFrame(raf); };
  }, []);

  const select = useCallback((i: number, focus?: boolean) => {
    const j = (i + N) % N;
    curRef.current = j;
    setCur(j);
    setRot(rotFor(G, j));
    if (focus) thumbs.current[j]?.focus({ preventScroll: true });
  }, [G]);

  const swipePanel = useSwipe((d) => select(curRef.current + d));
  const swipeOrbit = useSwipe((d) => select(curRef.current + d));

  const ma = G ? (G.mobile ? -90 : G.start + cur * G.step) : 0;

  return (
    <div className="fac" id="fac" style={orbitW ? ({ "--orbit-w": orbitW } as React.CSSProperties) : undefined}>
      <div className="orbit" id="orbit" ref={orbit} {...swipeOrbit.handlers}>
        <div
          className="orbit-c"
          style={G ? ({ left: G.cx + "px", top: G.cy + "px", "--r": G.r + "px", "--ts": G.ts + "px" } as React.CSSProperties) : { visibility: "hidden" }}
        >
          <div className="disc" aria-hidden="true" />
          <div className="ring" aria-hidden="true" />
          <div className="marker" aria-hidden="true" style={{ "--ma": ma + "deg" } as React.CSSProperties} />
          <M1Mark className="orbit-logo" />
          <div className="thumbs" role="tablist" aria-label="Founding faculty" onKeyDown={(e) => rovingKey(e, cur, N, (j) => select(j, true))}>
            {list.map((p, i) => {
              const a = G ? (G.mobile ? G.start + i * G.step + rot : G.start + i * G.step) : 0;
              const rr = G ? G.r + (i === cur ? (G.mobile ? -4 : 18) : 0) : 0;
              const vis = !G || !G.mobile || Math.abs(a + 90) < 38;
              return (
                <button
                  key={p.slug}
                  ref={(el) => { thumbs.current[i] = el; }}
                  className="thumb"
                  type="button"
                  role="tab"
                  id={`fac-tab-${i}`}
                  aria-controls="fac-panel"
                  aria-selected={i === cur}
                  tabIndex={i === cur ? 0 : -1}
                  aria-label={label(p)}
                  style={{ "--a": a + "deg", "--rr": rr + "px", visibility: vis ? undefined : "hidden" } as React.CSSProperties}
                  onClick={() => select(i)}
                >
                  <span className="ti" style={cropStyle(p.focus, `${IMG}${p.slug}-sm.webp`)} />
                  <span className="tn" aria-hidden="true">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fac-portrait" id="fac-panel" role="tabpanel" aria-labelledby={`fac-tab-${cur}`} {...swipePanel.handlers}>
        <div className="fp-frame">
          <div className="fp-inner">
            {list.map((p, i) => (
              <img
                key={p.slug}
                className={`fp-img${i === cur ? " is-on" : ""}`}
                src={`${IMG}${p.slug}.webp`}
                width={520}
                height={520}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                alt={i === cur ? `${label(p)}${p.role ? ", " + p.role : ", founding faculty"}` : ""}
                aria-hidden={i !== cur}
                style={{ "--z": p.zoom || 1 } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        <div className="fp-badge" aria-hidden="true"><M1Mark kind="solid" /></div>
      </div>

      <div className="fac-details">
        <div className={`fd-swap${out ? " is-out" : ""}`} aria-live="polite">
          <p className="fd-label">Founding Faculty</p>
          <h3 className="fd-name">{f.name}{f.post && <> <span className="fd-post">{f.post}</span></>}</h3>
          <p className="fd-role">{f.role || facultyRole}</p>
          <p className="fd-note">{f.founder ? "Founder of M One, opening Level One with eleven fellow founding faculty." : facultyNote}</p>
        </div>
        <div className="fd-ctrl">
          <button className="icon-btn" type="button" aria-label="Previous faculty member" onClick={() => select(curRef.current - 1)}>{Icon.prev()}</button>
          <span className="eco-count" aria-hidden="true"><b>{pad(cur + 1)}</b> / {pad(N)}</span>
          <span className="progress" aria-hidden="true" style={{ "--p": ((cur + 1) / N) * 100 + "%" } as React.CSSProperties}><i /></span>
          <button className="icon-btn" type="button" aria-label="Next faculty member" onClick={() => select(curRef.current + 1)}>{Icon.next()}</button>
        </div>
        <ol className="fd-index" aria-label="All founding faculty">
          {list.map((p, i) => (
            <li key={p.slug}>
              <button type="button" aria-current={i === cur ? "true" : "false"} onClick={() => select(i)}>
                <span>{pad(i + 1)}</span>{p.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
