"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { careerStages, faculty, modules, type ModuleKey } from "@/data/m1";
import { IMG, Icon, M1Mark, M1Text, cropStyle, pad, reduced, rovingKey } from "@/lib/m1";
import { useSwipe } from "@/lib/hooks";

const N = modules.length;
const facBy = (slug: string) => faculty.find((f) => f.slug === slug)!;
const Avatar = ({ slug, lg }: { slug: string; lg?: boolean }) => (
  <span className={`av img${lg ? " lg" : ""}`} style={cropStyle(facBy(slug).focus, `${IMG}${slug}-sm.webp`)} />
);
const Sk = ({ w, h }: { w: string; h?: number }) => <span className="sk" style={{ width: w, height: h }} />;

/* concept interfaces shown beside each module */
const MODULE_VISUAL: Record<ModuleKey, () => React.ReactNode> = {
  learning: () => (
    <>
      <div className="ui ui-player" style={{ left: "7%", top: "14%", width: "74%" }}>
        <div className="player">
          <img src={`${IMG}benjamin-sarkodie.webp`} alt="" loading="lazy" width={520} height={520} />
          <span className="live">Live</span>
          <span className="pl-dur">30–40 min</span>
          <div className="pl-bar"><i /></div>
        </div>
        <div className="pl-meta">
          <div><b>Weekly faculty lecture</b><span>Founding faculty · Level One</span></div>
          <span className="chip">Q&amp;A next</span>
        </div>
      </div>
      <div className="ui" style={{ right: "5%", bottom: "9%", width: "46%" }}>
        <div className="ui-h">Video repository<span>Sample</span></div>
        {[1, 2, 3].map((k) => (
          <div className="row" key={k}>
            <span className={`th th${k}`} />
            <div style={{ flex: 1 }}><Sk w={`${90 - k * 12}%`} /><Sk w={`${50 + k * 6}%`} /></div>
          </div>
        ))}
      </div>
      <div className="ui" style={{ left: "5%", bottom: "7%", width: "40%" }}>
        <div className="ui-h">Adaptive assessment</div>
        <div className="assess">
          <svg viewBox="0 0 40 40" className="ring-ui"><circle cx="20" cy="20" r="16" /><circle cx="20" cy="20" r="16" className="on" strokeDasharray="70 101" /></svg>
          <div className="opts"><span className="chip">A</span><span className="chip on">B</span><span className="chip">C</span></div>
        </div>
      </div>
    </>
  ),
  faculty: () => (
    <>
      <div className="ui" style={{ left: "7%", top: "13%", width: "60%" }}>
        <div className="ui-h">Global faculty directory {Icon.search()}</div>
        <div className="fgrid">
          {["jay-calvert", "biny-ajay", "ildus-ahmetov", "linka-matos", "girish-dewnany", "tiffany-john"].map((s) => (
            <div key={s}><Avatar slug={s} lg /><b>{facBy(s).name.replace("Dr. ", "")}</b></div>
          ))}
        </div>
      </div>
      <div className="ui" style={{ right: "5%", top: "28%", width: "38%" }}>
        <div className="ui-h">One-to-one mentorship<span>Sample</span></div>
        <div className="days">{["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, k) => <span key={d} className={k === 2 ? "on" : ""}>{d}</span>)}</div>
        <div className="slots"><span>09:00</span><span className="on">11:30</span><span>15:00</span></div>
        <div className="ui-btn">Request a session</div>
      </div>
      <div className="ui" style={{ left: "12%", bottom: "8%", width: "58%" }}>
        <div className="room">
          <span className="live">Live masterclass room</span>
          <div className="stack"><Avatar slug="martin-scott" /><Avatar slug="joseph-mcginley" /><Avatar slug="vasant-lad" /><span className="av">+</span></div>
        </div>
      </div>
    </>
  ),
  community: () => {
    const regions: [string, number, number][] = [["Middle East", 300, 70], ["South Asia", 340, 190], ["Africa", 200, 230], ["Europe", 110, 140], ["Americas", 90, 50]];
    return (
      <>
        <svg className="net" viewBox="0 0 420 280" aria-hidden="true">
          {regions.map(([n, x, y]) => <path key={n} d={`M210 140 Q ${(210 + x) / 2 + 30} ${(140 + y) / 2 - 30} ${x} ${y}`} />)}
          <circle cx="210" cy="140" r="30" className="core" />
          <text x="210" y="144" className="core-t">You</text>
          {regions.map(([n, x, y]) => (
            <g key={n}><circle cx={x} cy={y} r="20" className="reg" /><text x={x} y={y + 36} className="reg-t">{n}</text></g>
          ))}
        </svg>
        <div className="ui" style={{ right: "5%", bottom: "9%", width: "46%" }}>
          <div className="ui-h">Peer messaging {Icon.lock()}</div>
          <div className="bub l"><Sk w="80%" /><Sk w="55%" /></div>
          <div className="bub r"><Sk w="70%" /></div>
          <p className="enc">End-to-end encrypted · planned</p>
        </div>
        <div className="ui" style={{ left: "5%", bottom: "7%", width: "42%" }}>
          <div className="ui-h">Specialty forums</div>
          {["Sports & exercise medicine", "Surgery", "Dental", "Allied health"].map((t, k) => (
            <div className="frow" key={t}><span>{t}</span><i style={{ width: `${70 - k * 12}%` }} /></div>
          ))}
        </div>
      </>
    );
  },
  research: () => (
    <>
      <div className="ui" style={{ left: "7%", top: "13%", width: "56%" }}>
        <div className="ui-h">Manuscript · Draft<span>Sample</span></div>
        <Sk w="92%" h={11} /><Sk w="64%" h={11} />
        <div className="authors">{["AE", "GB", "IN", "KE"].map((a) => <span className="av" key={a}>{a}</span>)}<em>4 countries</em></div>
        {["Abstract", "Methods", "Results", "Discussion"].map((t, k) => <div key={t} className={`sec${k < 2 ? " done" : ""}`}><i />{t}</div>)}
        <div className="ui-btn ghost">Prepare for submission</div>
      </div>
      <div className="ui" style={{ right: "5%", top: "18%", width: "36%" }}>
        <div className="ui-h">Cross-border study</div>
        <svg viewBox="0 0 120 70" className="dots" aria-hidden="true">
          {Array.from({ length: 84 }, (_, k) => {
            const hot = [17, 34, 60].includes(k);
            return <circle key={k} cx={6 + (k % 14) * 8.3} cy={6 + Math.floor(k / 14) * 11} r={hot ? 3.2 : 1.4} className={hot ? "hot" : ""} />;
          })}
          <path d="M32 17 Q 50 6 85 28 Q 70 50 42 50" className="lnk" />
        </svg>
      </div>
      <div className="ui" style={{ right: "9%", bottom: "9%", width: "46%" }}>
        <div className="ui-h">Journal access</div>
        {[1, 2, 3].map((k) => (
          <div className="row" key={k}><span className={`spine s${k}`} /><div style={{ flex: 1 }}><Sk w={`${88 - k * 14}%`} /><Sk w="40%" /></div></div>
        ))}
      </div>
    </>
  ),
  clinical: () => (
    <>
      <div className="ui" style={{ left: "7%", top: "13%", width: "52%" }}>
        <div className="ui-h">Case · Anonymized<span>Sample</span></div>
        <div className="tags"><span className="chip">Sports medicine</span><span className="chip">Discussion open</span></div>
        {["Presentation", "History", "Examination"].map((t, k) => (
          <div className="fld" key={t}><b>{t}</b><Sk w={`${92 - k * 10}%`} /><Sk w={`${60 + k * 8}%`} /></div>
        ))}
      </div>
      <div className="ui" style={{ right: "5%", top: "20%", width: "42%" }}>
        <div className="ui-h">Decision tree<span>Illustrative</span></div>
        <svg viewBox="0 0 160 120" className="tree" aria-hidden="true">
          <path d="M80 18 V36 M80 36 H36 V54 M80 36 H124 V54 M36 72 V86 H18 V98 M36 86 H54 V98 M124 72 V98" />
          <rect x="52" y="4" width="56" height="16" rx="5" className="n on" />
          <rect x="10" y="54" width="52" height="16" rx="5" className="n" />
          <rect x="98" y="54" width="52" height="16" rx="5" className="n on" />
          <rect x="4" y="98" width="30" height="14" rx="4" className="n" />
          <rect x="40" y="98" width="30" height="14" rx="4" className="n" />
          <rect x="108" y="98" width="32" height="14" rx="4" className="n on" />
        </svg>
      </div>
      <div className="ui" style={{ left: "13%", bottom: "8%", width: "62%" }}>
        <div className="ui-h">Specialty diagnostic repository</div>
        <div className="folders">{["Orthopaedics", "Cardiology", "Dental", "Radiology"].map((t) => <span key={t}><i />{t}</span>)}</div>
      </div>
    </>
  ),
  career: () => (
    <>
      <div className="ui" style={{ left: "7%", top: "13%", width: "60%" }}>
        <div className="ui-h">CME transcript<span>Sample</span></div>
        <table className="tx">
          <tbody>
            {[["Weekly faculty lecture", "Wk 01"], ["Live Q&A", "Wk 02"], ["Quarterly workshop", "Q1"]].map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><span className="ok">Recorded</span></td></tr>
            ))}
          </tbody>
        </table>
        <p className="enc">Blockchain verification · proposed</p>
      </div>
      <div className="ui cert" style={{ right: "6%", top: "33%", width: "34%" }}>
        <M1Mark kind="solid" />
        <b>Certificate</b>
        <span>Sample · not issued</span>
      </div>
      <div className="ui" style={{ left: "10%", bottom: "8%", width: "64%" }}>
        <div className="ui-h">International career pathway</div>
        <div className="path">
          {careerStages.map((s, k) => (
            <span key={s.key} className={`${k < 4 ? "on" : ""}${k === 3 ? " now" : ""}`}><i />{s.title.replace("Undergraduates", "Undergrad")}</span>
          ))}
        </div>
      </div>
    </>
  ),
};

/* 04 ModuleStackCarousel — stacked deck, six tabs, autoplay */
export default function ModuleDeck() {
  const [cur, setCur] = useState(0);
  const [outIdx, setOutIdx] = useState<number | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const [touchHold, setTouchHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const busy = useRef(false);
  const curRef = useRef(0);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const deckRef = useRef<HTMLDivElement>(null);
  const touchT = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setUserPaused(reduced()), []);

  const go = useCallback((target: number) => {
    target = (target + N) % N;
    const from = curRef.current;
    if (busy.current || target === from) return;
    busy.current = true;
    const T = reduced() ? 60 : 700;
    const forward = (target - from + N) % N <= N / 2;
    if (forward) {
      setOutIdx(from);
      curRef.current = target;
      setCur(target);
      setTimeout(() => { setOutIdx(null); busy.current = false; }, T);
    } else {
      const inc = cards.current[target];
      if (inc) { inc.style.transition = "none"; inc.dataset.pos = "out"; void inc.offsetWidth; inc.style.transition = ""; }
      curRef.current = target;
      requestAnimationFrame(() => { setCur(target); setTimeout(() => { busy.current = false; }, T); });
    }
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.4 });
    if (deckRef.current) io.observe(deckRef.current);
    const vis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const playing = !userPaused && !hover && !kbFocus && !touchHold && inView && !docHidden;
  const swipe = useSwipe((d) => go(curRef.current + d));
  const short = (t: string) => t.replace(/^M1\s+/, "");

  const pointerProps = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHover(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setHover(false),
    onFocus: (e: React.FocusEvent) => setKbFocus((e.target as HTMLElement).matches(":focus-visible")),
    onBlur: () => setKbFocus(false),
  };

  const onSectionKey = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest(".deck-tabs") || !t.closest("#deck, #deck-controls") || ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(curRef.current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(curRef.current - 1); }
  };

  return (
    <section className="mod-section section theme-light" id="modules" aria-labelledby="mod-title" onKeyDown={onSectionKey}>
      <div className="wrap">
        <div className="mod-head">
          <div>
            <p className="eyebrow"><span className="idx">04</span>Integrated Modules</p>
            <h2 className="h2" id="mod-title">Six integrated modules. <em>One connected</em> medical ecosystem.</h2>
            <p className="lede">From education and mentorship to collaboration, clinical knowledge and lifelong career development, M1 brings essential professional experiences together.</p>
          </div>
          <div className="deck-controls" id="deck-controls" {...pointerProps}>
            <div className="deck-count" aria-hidden="true"><span>{modules[cur].n}</span><small>/ {pad(N)}</small></div>
            <button className="icon-btn" type="button" aria-label="Previous module" aria-controls="deck" onClick={() => go(curRef.current - 1)}>{Icon.prev()}</button>
            <button className="icon-btn deck-toggle" type="button" aria-controls="deck" aria-label={userPaused ? "Start automatic rotation" : "Stop automatic rotation"} onClick={() => setUserPaused((p) => !p)}>
              {userPaused ? Icon.play() : Icon.pause()}
            </button>
            <button className="icon-btn" type="button" aria-label="Next module" aria-controls="deck" onClick={() => go(curRef.current + 1)}>{Icon.next()}</button>
          </div>
        </div>
        <div
          className="deck"
          id="deck"
          ref={deckRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="M1 integrated modules"
          data-auto={String(!userPaused)}
          data-playing={String(playing)}
          {...pointerProps}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse") return;
            setTouchHold(true);
            clearTimeout(touchT.current);
            touchT.current = setTimeout(() => setTouchHold(false), 9000);
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === "modfill" && (e.target as HTMLElement).closest('.deck-tab[aria-selected="true"]')) go(curRef.current + 1);
          }}
        >
          <div className="deck-tabs" role="tablist" aria-label="The six M1 modules" onKeyDown={(e) => rovingKey(e, cur, N, (j) => { go(j); tabs.current[j]?.focus(); })}>
            {modules.map((m, i) => (
              <button
                key={m.key}
                ref={(el) => { tabs.current[i] = el; }}
                className={`deck-tab${i < cur ? " is-past" : ""}`}
                type="button"
                role="tab"
                id={`mod-tab-${i}`}
                aria-controls={`mod-card-${i}`}
                aria-selected={i === cur}
                tabIndex={i === cur ? 0 : -1}
                onClick={() => go(i)}
              >
                <span className="n">{m.n}</span>
                <span className="t">{short(m.title)}</span>
                <i className="bar" aria-hidden="true"><b /></i>
              </button>
            ))}
          </div>
          <div className="deck-stack" {...swipe.handlers}>
            {modules.map((m, i) => {
              const pos = i === outIdx ? "out" : String((i - cur + N) % N);
              const on = pos === "0";
              return (
                <article
                  key={m.key}
                  ref={(el) => { cards.current[i] = el; }}
                  className="deck-card"
                  id={`mod-card-${i}`}
                  role="tabpanel"
                  aria-labelledby={`mod-tab-${i}`}
                  data-pos={pos}
                  inert={!on}
                  aria-hidden={!on}
                >
                  <div className="card-inner">
                    <div className="card-text">
                      <p className="mod-num">Module {m.n} of {pad(N)}</p>
                      <h3 className="mod-title"><M1Text text={m.title} /></h3>
                      <p className="mod-statement">{m.statement}</p>
                      <p className="mod-intro">{m.intro}</p>
                      <ul className="mod-feats">{m.features.map((f) => <li key={f}>{f}</li>)}</ul>
                      <div className="card-foot">
                        <span className="status-pill">{m.status}</span>
                        <span className="note">Part of the proposed M1 platform architecture.</span>
                      </div>
                    </div>
                    <div className={`mv mv-${m.key}`}>
                      {m.photo ? <img className="mv-photo" src={m.photo} alt="" /> : (<><span className="mv-tag">Concept interface</span>{MODULE_VISUAL[m.key]()}</>)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="sr-only" aria-live={userPaused ? "polite" : "off"}>
            Module {modules[cur].n} of {pad(N)}: {modules[cur].title}
          </p>
        </div>
      </div>
    </section>
  );
}
