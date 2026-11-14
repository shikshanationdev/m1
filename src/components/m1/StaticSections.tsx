import { heroCapabilities, nav } from "@/data/m1";
import { Icon, M1Mark } from "@/lib/m1";

/* 01 HeroSection */
export function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Global Medical Education &amp; Professional Ecosystem</p>
          <h1 className="hero-title" id="hero-title">
            <span className="hl">
              <span className="m1word">
                M<span>1</span>
              </span>
              : The Single
            </span>
            <span className="hl">Platform for the</span>
            <span className="hl">
              <em>World&apos;s Doctors</em>
            </span>
          </h1>
          <p className="hero-lede">
            One unified membership to manage your practice credentials, access global sub-specialty mentorship, track CME
            compliance, and collaborate with international peers.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#register">
              Join the M1 Community <span className="arr" aria-hidden="true">→</span>
            </a>
            <a className="btn btn-ghost" href="#ecosystem">
              Explore the Ecosystem
            </a>
          </div>
          <div className="hero-caps">
            <p className="caps-label">
              Planned platform capabilities <span className="status-pill">In development</span>
            </p>
            <ul>
              {heroCapabilities.map((c) => (
                <li key={c.name}>
                  {Icon[c.icon]()}
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="hero-visual">
          <svg className="sculpture" viewBox="190 104 430 350" aria-hidden="true">
            <use className="sc-lines" href="#m1-lines" x="205" y="118" width="396" height="319" />
            <use className="sc-depth" href="#m1-solid" x="318" y="246" width="247" height="196" />
            <use className="sc-front" href="#m1-solid" x="312" y="239" width="247" height="196" />
            <use className="sc-sheen" href="#m1-solid" x="312" y="239" width="247" height="196" />
          </svg>
          <div className="hero-flare" aria-hidden="true" />
          <img
            className="hero-founder"
            src="/img/faculty/george-john-hero.webp"
            width={1100}
            height={1100}
            alt="Dr. George John, Founder and President of M One, in navy surgical scrubs with arms crossed"
            fetchPriority="high"
          />
          <figcaption className="hero-credit">
            <span className="hc-name">Dr. George John</span>
            <span className="hc-role">Founder &amp; President, M One</span>
          </figcaption>
        </figure>
      </div>
      <div className="hero-floor" aria-hidden="true" />
    </section>
  );
}

function Plate({ slug, alt, name, className }: { slug: string; alt: string; name: string; className: string }) {
  return (
    <>
      <div className="plate-tri" aria-hidden="true" />
      <div className="plate-arch">
        <div className="plate-echo" aria-hidden="true" />
        <img src={`/img/faculty/${slug}.webp`} width={520} height={520} loading="lazy" alt={alt} />
      </div>
      {className === "level" && (
        <div className="level-chip">
          <span className="dot" aria-hidden="true" />
          Weekly · 30–40 minute live lecture
        </div>
      )}
      <figcaption>
        <span>{name}</span> Founding faculty
      </figcaption>
    </>
  );
}

/* 02 Vision & Mission */
export function Vision() {
  return (
    <section className="vision section" id="vision" aria-labelledby="vision-title">
      <div className="wrap">
        <p className="eyebrow">
          <span className="idx">02</span>Vision &amp; Mission
        </p>
        <div className="vision-top">
          <blockquote className="vision-quote">
            <p id="vision-title">
              Medicine&apos;s next generation, <em>taught by its present one.</em>
            </p>
            <footer>The M1 founding philosophy</footer>
          </blockquote>
          <figure className="vision-art m1-plate" data-plate="vasant-lad">
            <Plate slug="vasant-lad" name="Dr. Vasant Lad" className="vision" alt="Dr. Vasant Lad, founding faculty, smiling in a cream jacket" />
          </figure>
        </div>
        <div className="vision-split">
          <article className="vm vm-vision">
            <p className="vm-label">Vision</p>
            <h2 className="vm-head">A connected future for every medical professional.</h2>
            <p>
              To bring the global medical community into a lifelong ecosystem where knowledge, mentorship, clinical
              understanding, professional collaboration, research, and career development remain connected throughout every
              stage of a medical career.
            </p>
          </article>
          <div className="vm-rule" aria-hidden="true">
            <span />
          </div>
          <article className="vm vm-mission">
            <p className="vm-label">Mission</p>
            <h2 className="vm-head">Make professional growth continuous, connected and accessible.</h2>
            <p>
              To unite medical learning, mentoring, clinical case knowledge, global networking, research, and career
              progression into one persistent professional identity.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function LevelPlate() {
  return (
    <figure className="level-visual m1-plate" data-plate="tom-yarema">
      <Plate slug="tom-yarema" name="Dr. Tom Yarema" className="level" alt="Dr. Tom Yarema, founding faculty, in a white coat seated at a desk" />
    </figure>
  );
}

/* Shared section header */
export function SecHead({
  idx, eyebrow, id, title, lede, variant,
}: { idx: string; eyebrow: string; id: string; title: React.ReactNode; lede: string; variant?: "tight" | "right" }) {
  return (
    <div className={`sec-head${variant ? ` sec-head--${variant}` : ""}`}>
      <div>
        <p className="eyebrow">
          <span className="idx">{idx}</span>
          {eyebrow}
        </p>
        <h2 className="h2" id={id}>
          {title}
        </h2>
      </div>
      <p className="lede">{lede}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <M1Mark className="foot-mark" />
          <div>
            <p className="foot-name">M One Global Medical Education</p>
            <p className="foot-loc">Dubai, UAE</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="foot-links">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="#register">Register</a>
            </li>
          </ul>
        </nav>
        <div className="foot-meta">
          <a href="#privacy" className="foot-privacy">
            Privacy notice
          </a>
          <p>© 2026 M1 Global Medical Education. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
