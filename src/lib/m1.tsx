import type { CSSProperties, KeyboardEvent, ReactNode } from "react";

export const IMG = "/img/faculty/";
export const pad = (n: number | string) => String(n).padStart(2, "0");
export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* "M1" in copy is rendered with an orange "1" */
export function M1Text({ text }: { text: string }) {
  const parts = text.split(/\bM1\b/);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && (
            <>
              M<span className="one">1</span>
            </>
          )}
          {p}
        </span>
      ))}
    </>
  );
}

/* ---------- icons ---------- */
const svg = (d: ReactNode, w = 1.6, size?: number) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width={size} height={size}>
    {d}
  </svg>
);
export const Icon = {
  prev: () => svg(<path d="M15 5l-7 7 7 7" />),
  next: () => svg(<path d="M9 5l7 7-7 7" />),
  close: (size?: number) => svg(<path d="M6 6l12 12M18 6L6 18" />, 1.6, size),
  file: () => svg(<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 14l2 2 4-4" /></>),
  match: () => svg(<><circle cx="7" cy="9" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2.5 19c.8-2.6 2.5-4 4.5-4s3.7 1.4 4.5 4M12.5 19c.8-2.6 2.5-4 4.5-4s3.7 1.4 4.5 4" /><path d="M10 9h4" /></>),
  id: () => svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16c.6-1.4 1.8-2.2 3.2-2.2s2.6.8 3.2 2.2M14.5 10h4M14.5 13h3" /></>),
  lock: () => svg(<><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></>),
  search: () => svg(<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>),
  globe: () => svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>),
  route: () => svg(<><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 000-6H9a3 3 0 010-6h6.5" /></>),
  flask: () => svg(<><path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" /><path d="M7.5 15h9" /></>),
  people: () => svg(<><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.9-3 3-4.6 5.5-4.6s4.6 1.6 5.5 4.6" /><circle cx="17" cy="9" r="2.4" /><path d="M15.5 14.3c2.3.1 4 1.6 4.8 4.2" /></>),
  play: () => svg(<path d="M8 5l11 7-11 7z" />),
  pause: () => svg(<path d="M8 5v14M16 5v14" />, 2),
};

/* the M1 mark from the sprite */
export function M1Mark({ kind = "full", className }: { kind?: "full" | "solid" | "lines"; className?: string }) {
  if (kind === "solid")
    return (
      <svg className={className} viewBox="312 239 247 196" aria-hidden="true">
        <use href="#m1-solid" x="312" y="239" width="247" height="196" />
      </svg>
    );
  return (
    <svg className={className} viewBox="205 118 396 319" aria-hidden="true">
      <use href={`#m1-${kind}`} x="205" y="118" width="396" height="319" />
    </svg>
  );
}

/* ---------- interaction helpers ---------- */
/** arrow / Home / End keys over a set of tabs */
export function rovingKey(e: KeyboardEvent, cur: number, n: number, select: (j: number) => void, orientation: "horizontal" | "vertical" = "horizontal") {
  const fwd = orientation === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"];
  const back = orientation === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
  let j: number | null = null;
  if (fwd.includes(e.key)) j = (cur + 1) % n;
  else if (back.includes(e.key)) j = (cur - 1 + n) % n;
  else if (e.key === "Home") j = 0;
  else if (e.key === "End") j = n - 1;
  if (j === null) return;
  e.preventDefault();
  select(j);
}

/** thumbnail crop: put face point (fx, fy) at the centre at zoom s */
export function cropStyle(f: [number, number, number], url: string): CSSProperties {
  const [fx, fy, s] = f;
  const px = s === 1 ? 50 : Math.max(0, Math.min(100, ((0.5 - fx * s) / (1 - s)) * 100));
  const py = s === 1 ? 50 : Math.max(0, Math.min(100, ((0.5 - fy * s) / (1 - s)) * 100));
  return {
    backgroundImage: `url('${url}')`,
    backgroundSize: `${(s * 100).toFixed(0)}%`,
    backgroundPosition: `${px.toFixed(1)}% ${py.toFixed(1)}%`,
  };
}

/* ---------- M1 shape geometry (normalised from the logo clip paths) ---------- */
export const SHAPE = {
  tri: "M 0.5774 0.0595 C 0.5704 0.0497 0.5544 0.0283 0.5223 0.0141 C 0.4960 0.0025 0.4685 0.0000 0.4472 0.0002 C 0.4445 0.0002 0.4417 0.0003 0.4390 0.0005 L 0.3987 0.0035 C 0.3533 0.0068 0.3154 0.0313 0.3039 0.0648 C 0.2513 0.2184 0.0959 0.6499 0.0223 0.8691 C 0.0000 0.9355 0.0663 1.0000 0.1565 0.9996 L 0.9121 0.9963 C 0.9394 0.9136 0.9666 0.8308 0.9938 0.7480 C 1.0000 0.7293 0.9973 0.7095 0.9862 0.6921 C 0.7687 0.3497 0.6083 0.1029 0.5774 0.0595",
  arch: "M 0.0602 0.7602 L 0.3732 0.1373 C 0.4122 0.0597 0.5322 0.0055 0.6706 0.0031 C 0.8509 0.0000 1.0000 0.0846 1.0000 0.1901 L 1.0000 0.8130 C 1.0000 0.9162 0.8568 1.0000 0.6801 1.0000 L 0.3671 1.0000 C 0.1536 1.0000 0.0000 0.8800 0.0602 0.7602",
};
