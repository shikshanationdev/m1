"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { M1_CONFIG, formStages } from "@/data/m1";
import { M1Mark } from "@/lib/m1";

type Key = "fullName" | "city" | "country" | "careerStage" | "email" | "phone" | "consent";
const KEYS: Key[] = ["fullName", "city", "country", "careerStage", "email", "phone", "consent"];
const CONSENT_TEXT = "I agree that M1 may store these details to contact me about my registration and Level One.";
const byName = new Map(COUNTRIES.map((c) => [c.name.toLowerCase(), c]));
const byIso = new Map(COUNTRIES.map((c) => [c.iso, c]));

class UserError extends Error {}

async function submitLead(payload: unknown) {
  if (!M1_CONFIG.endpoint)
    throw new UserError("Registration isn’t connected on this copy of the page yet, so your details were not sent. The site owner needs to add a registration endpoint.");
  let r: Response;
  try {
    r = await fetch(M1_CONFIG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch {
    throw new UserError("We couldn’t reach the registration service. Check your connection and try again.");
  }
  if (r.status === 409) throw new UserError("This email address is already registered. You don’t need to register again.");
  if (r.status === 429) throw new UserError("Too many attempts. Wait a minute, then try again.");
  if (!r.ok) throw new UserError(`The registration service returned an error (${r.status}). Please try again shortly.`);
}

/* 09 RegistrationForm */
export default function RegistrationForm() {
  const [v, setV] = useState({ fullName: "", city: "", country: "", careerStage: "", email: "", phone: "", website: "", consent: false, newsOptIn: false });
  const [dial, setDial] = useState("AE");
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [status, setStatus] = useState<{ msg: string; error: boolean }>({ msg: "", error: false });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const dialTouched = useRef(false);
  const loadedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDetailsElement>(null);

  /* default calling code from the browser locale */
  useEffect(() => {
    loadedAt.current = Date.now();
    const region = (navigator.language || "").split("-")[1]?.toUpperCase();
    if (region && byIso.has(region)) setDial(region);
    /* any "How we use your details" link opens the privacy note */
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href="#privacy"]') && privacyRef.current) privacyRef.current.open = true;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => { if (done) successRef.current?.focus(); }, [done]);

  const dialOf = byIso.get(dial)!;
  const matchCountry = (name = v.country) => byName.get(name.trim().toLowerCase());
  const nationalDigits = (phone = v.phone, dc = dialOf) => {
    let d = phone.replace(/[^\d]/g, "");
    if (d.startsWith("00" + dc.code)) d = d.slice(2 + dc.code.length);
    if (!["IT", "SM", "VA"].includes(dc.iso)) d = d.replace(/^0+/, "");
    return d;
  };

  const rule = (k: Key, s = v, dc = dialOf): string => {
    switch (k) {
      case "fullName": { const t = s.fullName.trim(); if (!t) return "Enter your full name."; if (t.length < 2 || !/\p{L}/u.test(t)) return "Enter your name using letters."; return ""; }
      case "city": { const t = s.city.trim(); if (!t) return "Enter the city you live or work in."; if (!/\p{L}/u.test(t)) return "Enter a city name."; return ""; }
      case "country": if (!s.country.trim()) return "Choose your country."; if (!matchCountry(s.country)) return "Choose a country from the list."; return "";
      case "careerStage": return s.careerStage ? "" : "Choose the career stage that fits you best.";
      case "email": { const t = s.email.trim(); if (!t) return "Enter your email address."; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return "Enter an email address like you@example.com."; return ""; }
      case "phone": {
        const raw = s.phone.trim();
        if (!raw) return "Enter your phone number.";
        if (/[^\d\s()+\-.]/.test(raw)) return "Use digits only, with spaces or dashes if you like.";
        const d = nationalDigits(s.phone, dc), total = d.length + dc.code.length;
        if (d.length < 4 || total < 8 || total > 15) return `Enter a valid number for +${dc.code}. International numbers are up to 15 digits including the country code.`;
        return "";
      }
      case "consent": return s.consent ? "" : "Tick the box to agree before registering.";
    }
  };

  const validate = (k: Key, s = v, dc = dialOf) => {
    const msg = rule(k, s, dc);
    setErrors((e) => ({ ...e, [k]: msg }));
    return !msg;
  };

  /* inputs re-validate as you type once they've shown an error */
  const update = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if ((KEYS as string[]).includes(k) && errors[k as Key]) validate(k as Key, next);
  };
  const blur = (k: Key) => () => {
    const has = k === "consent" ? v.consent : String(v[k]).length > 0;
    if (has || touched[k]) validate(k);
    setTouched((t) => ({ ...t, [k]: true }));
  };

  const phoneHint = useMemo(() => {
    const d = nationalDigits();
    return !errors.phone && d && touched.phone && !rule("phone")
      ? `Saved as +${dialOf.code} ${d.replace(/(\d{2,3})(?=(\d{3,4})+$)/g, "$1 ")}`
      : "Saved in international format.";
  }, [v.phone, dial, errors.phone, touched.phone]);

  const fieldCls = (k: Key) => `field${errors[k] ? " invalid" : errors[k] === "" ? " valid" : ""}`;
  const inv = (k: Key) => ({ "aria-invalid": !!errors[k] });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setStatus({ msg: "", error: false });
    const results = KEYS.map((k) => validate(k));
    if (!results.every(Boolean)) {
      const first = KEYS[results.indexOf(false)];
      formRef.current?.querySelector<HTMLElement>(`[data-key="${first}"]`)?.focus();
      setStatus({ msg: "Some details need attention before you can register.", error: true });
      return;
    }
    if (v.website || Date.now() - loadedAt.current < 2500) {
      setStatus({ msg: "Please wait a moment, then submit again.", error: true });
      return;
    }
    const email = v.email.trim().toLowerCase();
    let seen: string | null = null;
    try { seen = localStorage.getItem("m1-reg:" + email); } catch { /* storage blocked */ }
    if (seen && Date.now() - Number(seen) < 864e5) {
      setStatus({ msg: "This email address was already registered from this browser today. You don’t need to register again.", error: true });
      return;
    }
    const c = matchCountry()!, nd = nationalDigits();
    const q = new URLSearchParams(location.search), utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => { const x = q.get(k); if (x) utm[k] = x.slice(0, 120); });
    const payload = {
      fullName: v.fullName.trim(), city: v.city.trim(), country: c.name, countryCode: c.iso, careerStage: v.careerStage, email,
      phone: { dialCode: "+" + dialOf.code, dialCountry: dialOf.iso, national: nd, e164: "+" + dialOf.code + nd },
      consent: { contact: true, newsOptIn: v.newsOptIn, text: CONSENT_TEXT },
      meta: {
        submittedAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        locale: navigator.language || null,
        referrer: document.referrer || null,
        utm: Object.keys(utm).length ? utm : null,
        formVersion: M1_CONFIG.formVersion,
        secondsOnForm: Math.round((Date.now() - loadedAt.current) / 1000),
      },
    };
    setBusy(true);
    try {
      await submitLead(payload);
      try { localStorage.setItem("m1-reg:" + email, String(Date.now())); } catch { /* storage blocked */ }
      setDone(true);
    } catch (err) {
      setStatus({ msg: err instanceof UserError ? err.message : "We couldn’t send your registration. Please try again.", error: true });
    } finally {
      setBusy(false);
    }
  };

  const Err = ({ k, id }: { k: Key; id: string }) => <p className="err" id={id} aria-live="polite">{errors[k]}</p>;

  return (
    <div className="form-panel" id="form-panel">
      <form id="reg-form" ref={formRef} noValidate onSubmit={onSubmit} hidden={done}>
        <div className="form-head">
          <p className="form-title">Register Your Interest</p>
          <p className="form-note"><span className="req" aria-hidden="true">*</span> Required</p>
        </div>

        <div className={fieldCls("fullName")}>
          <label htmlFor="f-name">Full Name <span className="req" aria-hidden="true">*</span></label>
          <input id="f-name" data-key="fullName" name="fullName" type="text" autoComplete="name" placeholder="Enter your full name" required maxLength={120} aria-describedby="e-name" {...inv("fullName")}
            value={v.fullName} onChange={(e) => update("fullName", e.target.value)} onBlur={blur("fullName")} />
          <Err k="fullName" id="e-name" />
        </div>

        <fieldset className="field-group">
          <legend>City &amp; Country <span className="req" aria-hidden="true">*</span></legend>
          <div className="row-2">
            <div className={fieldCls("city")}>
              <label htmlFor="f-city" className="sub-label">City</label>
              <input id="f-city" data-key="city" name="city" type="text" autoComplete="address-level2" placeholder="e.g. Dubai" required maxLength={80} aria-describedby="e-city" {...inv("city")}
                value={v.city} onChange={(e) => update("city", e.target.value)} onBlur={blur("city")} />
              <Err k="city" id="e-city" />
            </div>
            <div className={fieldCls("country")}>
              <label htmlFor="f-country" className="sub-label">Country</label>
              <input id="f-country" data-key="country" name="country" type="text" list="country-list" autoComplete="country-name" placeholder="Start typing a country" required aria-describedby="e-country" {...inv("country")}
                value={v.country}
                onChange={(e) => update("country", e.target.value)}
                onBlur={(e) => {
                  const c = matchCountry(e.target.value);
                  let next = v, dc = dialOf;
                  if (c) {
                    next = { ...v, country: c.name };
                    setV(next);
                    if (!dialTouched.current) { setDial(c.iso); dc = c; }
                  }
                  if (next.country || touched.country) validate("country", next, dc);
                  setTouched((t) => ({ ...t, country: true }));
                }} />
              <datalist id="country-list">{COUNTRIES.map((c) => <option key={c.iso} value={c.name} />)}</datalist>
              <Err k="country" id="e-country" />
            </div>
          </div>
        </fieldset>

        <div className={fieldCls("careerStage")}>
          <label htmlFor="f-stage">Career Stage <span className="req" aria-hidden="true">*</span></label>
          <div className="select-wrap">
            <select id="f-stage" data-key="careerStage" name="careerStage" required aria-describedby="e-stage" {...inv("careerStage")}
              value={v.careerStage}
              onChange={(e) => { const next = { ...v, careerStage: e.target.value }; setV(next); if (errors.careerStage !== undefined) validate("careerStage", next); }}
              onBlur={blur("careerStage")}>
              <option value="">Select your career stage</option>
              {formStages.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Err k="careerStage" id="e-stage" />
        </div>

        <div className={fieldCls("email")}>
          <label htmlFor="f-email">Email Address <span className="req" aria-hidden="true">*</span></label>
          <input id="f-email" data-key="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required maxLength={160} aria-describedby="e-email" {...inv("email")}
            value={v.email} onChange={(e) => update("email", e.target.value)} onBlur={blur("email")} />
          <Err k="email" id="e-email" />
        </div>

        <div className={fieldCls("phone")}>
          <label htmlFor="f-phone">Phone Number <span className="req" aria-hidden="true">*</span></label>
          <div className="phone">
            <div className="dial">
              <span className="dial-face" aria-hidden="true">+{dialOf.code}</span>
              <select id="f-dial" name="dial" aria-label="Country calling code" value={dial}
                onChange={(e) => { dialTouched.current = true; setDial(e.target.value); if (v.phone) validate("phone", v, byIso.get(e.target.value)!); }}>
                {COUNTRIES.map((c) => <option key={c.iso} value={c.iso}>{c.name} (+{c.code})</option>)}
              </select>
            </div>
            <input id="f-phone" data-key="phone" name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="Phone number" required aria-describedby="e-phone h-phone" {...inv("phone")}
              value={v.phone} onChange={(e) => update("phone", e.target.value)} onBlur={blur("phone")} />
          </div>
          <p className="hint" id="h-phone">{phoneHint}</p>
          <Err k="phone" id="e-phone" />
        </div>

        <div className="hp" aria-hidden="true">
          <label htmlFor="f-website">Leave this field empty</label>
          <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} />
        </div>

        <div className="consent">
          <label className={`check${errors.consent ? " invalid" : ""}`} htmlFor="f-consent">
            <input id="f-consent" data-key="consent" name="consent" type="checkbox" required aria-describedby="e-consent" {...inv("consent")}
              checked={v.consent} onChange={(e) => update("consent", e.target.checked)} />
            <span className="box" aria-hidden="true" />
            <span>
              {CONSENT_TEXT}{" "}
              <a href={M1_CONFIG.privacyUrl || "#privacy"} className="inline-link">How we use your details</a>
            </span>
          </label>
          <Err k="consent" id="e-consent" />
          <label className="check" htmlFor="f-news">
            <input id="f-news" name="newsOptIn" type="checkbox" checked={v.newsOptIn} onChange={(e) => setV({ ...v, newsOptIn: e.target.checked })} />
            <span className="box" aria-hidden="true" />
            <span>Also send me occasional M1 news and announcements. Optional.</span>
          </label>
        </div>

        <details className="privacy" id="privacy" ref={privacyRef}>
          <summary>How we use your details</summary>
          <p>
            Your name, location, career stage, email and phone number are used only to respond to your registration and to send
            updates about Level One and the M1 platform. News and announcements are sent only if you tick the optional box. You
            can ask for your details to be removed at any time. The full privacy policy will be linked here before launch.
          </p>
        </details>

        <button className="btn btn-primary btn-submit" type="submit" aria-busy={busy}>
          <span className="lbl">{busy ? "Sending your details…" : "Join the M1 Community"}</span>
          <span className="arr" aria-hidden="true">→</span>
          <span className="spin" aria-hidden="true" />
        </button>
        <p className={`form-status${status.error ? " error" : ""}`} role="status" aria-live="polite">{status.msg}</p>
      </form>

      <div className="form-success" ref={successRef} hidden={!done} tabIndex={-1}>
        <M1Mark kind="solid" className="success-mark" />
        <p className="form-title">Thank you for your interest in M1.</p>
        <p>Your details have been received. We will share relevant updates as the M1 community develops.</p>
      </div>
    </div>
  );
}
