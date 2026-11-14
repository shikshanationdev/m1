/* =========================================================================
   M1 — structured content. Components read only from this module.
   To add photography later, set the `photo` field on a stage / module;
   components switch from brand art to the photo.
   ========================================================================= */

export const M1_CONFIG = {
  /* Production lead capture: set NEXT_PUBLIC_M1_REGISTER_ENDPOINT (POST, JSON body). */
  endpoint: process.env.NEXT_PUBLIC_M1_REGISTER_ENDPOINT ?? "",
  formVersion: "2026-11-m1-register-v1",
  privacyUrl: process.env.NEXT_PUBLIC_M1_PRIVACY_URL ?? "",
};

export type NavItem = { id: string; label: string };
export type IconName =
  | "file" | "match" | "id" | "book" | "stethoscope" | "clipboard" | "monitor" | "staff" | "laurel";

export type CareerStage = {
  n: string; key: string; title: string; role: string; chip: string; text: string;
  icon: "book" | "stethoscope" | "clipboard" | "monitor" | "staff" | "laurel";
  photo?: string; alt?: string; pos?: string;
};

export type ModuleKey = "learning" | "faculty" | "community" | "research" | "clinical" | "career";
export type Module = {
  n: string; key: ModuleKey; title: string; statement: string; intro: string;
  features: string[]; status: string; photo?: string;
};

export type Faculty = {
  slug: string; name: string; role?: string; post?: string; founder?: boolean;
  /** face centre in the cut-out (x, y as fractions) and thumbnail zoom */
  focus: [number, number, number];
  zoom?: number;
};

export type Stamp = { lines: string[]; shape: "circle" | "rect"; color: string; x: number; y: number; r: number };

export const nav: NavItem[] = [
  { id: "vision", label: "Vision" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "modules", label: "Modules" },
  { id: "level-one", label: "Level One" },
  { id: "ladder", label: "M1 Ladder" },
  { id: "faculty", label: "Faculty" },
  { id: "passport", label: "Passport" },
];

export const heroCapabilities: { name: string; icon: "file" | "match" | "id" }[] = [
  { name: "Autonomous CME Board Filing", icon: "file" },
  { name: "Global Peer Mentor Matcher", icon: "match" },
  { name: "Verified Digital Identity", icon: "id" },
];

/* Six-stage career continuum (NEXTbit architecture, p.3). */
export const careerStages: CareerStage[] = [
  { n: "01", key: "pre-medical", title: "Pre-Medical", role: "Aspiring Healthcare Students", chip: "Before medical school",
    text: "Future doctors, and those exploring sports science, physiotherapy, chiropractic, and other allied health paths.", icon: "book" },
  { n: "02", key: "undergraduates", title: "Undergraduates", role: "Medical School Students", chip: "In medical school",
    text: "Structured exposure to specialties and real clinical thinking, alongside the standard curriculum.", icon: "stethoscope" },
  { n: "03", key: "early-career", title: "Early Career", role: "Interns & Junior Doctors", chip: "Choosing a direction",
    text: "Support for the decision so many face early on: which specialty, which masters, which path forward.", icon: "clipboard" },
  { n: "04", key: "trainees", title: "Trainees", role: "Residents & Registrars", chip: "In training",
    text: "Deepening expertise in a chosen field, with faculty who are still operating and practising themselves.", icon: "monitor" },
  { n: "05", key: "specialists", title: "Specialists", role: "Practising Consultants", chip: "In practice",
    text: "Staying current on techniques, technology, and adjacent fields: sports science, innovation, new equipment.", icon: "staff" },
  { n: "06", key: "leaders", title: "Leaders", role: "Professors & Educators", chip: "Leading the field",
    text: "A platform to teach on, contribute research to, and shape the next generation of the profession.", icon: "laurel" },
];

/* Six integrated modules (NEXTbit architecture, p.4) — proposed platform. */
export const modules: Module[] = [
  { n: "01", key: "learning", title: "M1 Learning Hub", statement: "Where teaching happens, live and on demand.",
    intro: "One learning space for live teaching, recorded lectures and practical sessions, with assessments that adapt to each learner.",
    features: ["Live streams", "Video repositories", "Interactive workshops", "Adaptive assessments"], status: "Proposed module" },
  { n: "02", key: "faculty", title: "M1 Faculty Connect", statement: "Direct access to the people who teach.",
    intro: "Find faculty across the world, book one-to-one mentorship, and join masterclasses as they happen.",
    features: ["Global faculty directories", "One-to-one mentorship bookings", "Live masterclass rooms"], status: "Proposed module" },
  { n: "03", key: "community", title: "M1 Professional Community", statement: "Colleagues by region and by specialty.",
    intro: "A professional network organised the way medicine is: by where you practise and what you practise.",
    features: ["Encrypted peer messaging", "Regional professional circles", "Specialty-based forums"], status: "Proposed module" },
  { n: "04", key: "research", title: "M1 Research & Innovation", statement: "Research that crosses borders.",
    intro: "Shared workspaces for multi-country studies, with tools that carry a paper from draft to submission.",
    features: ["Cross-border study collaboration", "Paper-publishing tools", "Journal access"], status: "Proposed module" },
  { n: "05", key: "clinical", title: "M1 Clinical Knowledge", statement: "Case knowledge, shared with care.",
    intro: "Anonymized cases discussed by peers, structured decision trees, and diagnostic references organised by specialty.",
    features: ["Anonymized clinical case discussions", "Decision trees", "Specialty diagnostic repositories"], status: "Proposed module" },
  { n: "06", key: "career", title: "M1 Career & Development", statement: "A record that follows your career.",
    intro: "Learning records, certificates and international pathways kept together, with verified CME transcripts planned.",
    features: ["Blockchain-verified CME transcripts (proposed)", "Certificates", "International career pathways"], status: "Proposed module" },
];

/* Level One program (Level One document, pp.2–3). */
export const programFeatures: { n: string; title: string; text: string; tag?: string }[] = [
  { n: "01", title: "Weekly faculty lecture",
    text: "A 30–40 minute lecture every week for a full year, delivered live by one of the founding faculty, on a different topic each week." },
  { n: "02", title: "Live Q&A",
    text: "Members can put questions to faculty directly, with dedicated question-and-answer sessions following the lecture series." },
  { n: "03", title: "Quarterly half-day workshop",
    text: "Every three months, a half-day workshop: hands-on sessions, sports science and exercise programs, and briefings on new equipment and technology in the field." },
  { n: "04", title: "25,000 members, Year One", tag: "Target",
    text: "Our target for the first year across all entry stages, pre-med through professor, with structure by level introduced as the community grows." },
];

export const programStats = [
  { value: "52", label: "Weekly lectures" },
  { value: "12", label: "Founding faculty" },
  { value: "4", label: "Quarterly workshops" },
];

/* Seven-level ladder. Only Level 01 has confirmed programme detail. */
export const ladder: { n: string; name: string; detail?: string; current?: boolean }[] = [
  { n: "01", name: "Foundations", detail: "Weekly lectures & quarterly workshops.", current: true },
  { n: "02", name: "Structured Pathway Tracks" },
  { n: "03", name: "Applied Clinical Modules" },
  { n: "04", name: "Specialty Deep-Dives" },
  { n: "05", name: "Mentored Practice" },
  { n: "06", name: "Research & Fellowship Track" },
  { n: "07", name: "Faculty & Leadership" },
];

/* Founding faculty. No biographies were supplied, so none are shown. */
export const faculty: Faculty[] = [
  { slug: "george-john", name: "Dr. George John", role: "Founder & President, M One", founder: true, focus: [0.49, 0.25, 2.5], zoom: 1.18 },
  { slug: "jay-calvert", name: "Dr. Jay Calvert", post: "M.D.", focus: [0.55, 0.38, 1.55] },
  { slug: "tom-yarema", name: "Dr. Tom Yarema", focus: [0.53, 0.29, 1.65] },
  { slug: "martin-scott", name: "Dr. Martin Scott", focus: [0.52, 0.3, 1.8] },
  { slug: "ildus-ahmetov", name: "Dr. Ildus Ahmetov", focus: [0.5, 0.38, 1.7] },
  { slug: "biny-ajay", name: "Dr. Biny Ajay", focus: [0.52, 0.34, 1.65] },
  { slug: "linka-matos", name: "Dr. Linka Matos", focus: [0.6, 0.4, 1.6] },
  { slug: "benjamin-sarkodie", name: "Dr. Benjamin Sarkodie", focus: [0.37, 0.3, 1.65] },
  { slug: "girish-dewnany", name: "Dr. Girish Dewnany", focus: [0.55, 0.32, 1.7] },
  { slug: "joseph-mcginley", name: "Dr. Joseph McGinley", post: "MD, PhD", focus: [0.44, 0.27, 1.8] },
  { slug: "tiffany-john", name: "Dr. Tiffany John", focus: [0.5, 0.31, 1.7] },
  { slug: "vasant-lad", name: "Dr. Vasant Lad", focus: [0.57, 0.4, 1.5] },
];
export const facultyRole = "Founding faculty";
export const facultyNote = "Leads a rotation of Level One weekly lectures in their area of specialty.";

/* Career-stage options for the registration form mirror careerStages. */
export const formStages = [
  "Pre-Medical — Aspiring Healthcare Student",
  "Undergraduate — Medical School Student",
  "Early Career — Intern / Junior Doctor",
  "Trainee — Resident / Registrar",
  "Specialist — Practising Consultant",
  "Leader — Professor / Educator",
];

/* M1 Passport — concept preview. The holder and every record are fictional;
   no regulator names or licence numbers are used. */
export const passport = {
  holder: { photo: "", alt: "Passport photo of the holder, a doctor", pos: "" },
  identity: [
    ["Surname", "RAHMAN"], ["Given names", "LEILA"], ["Profession", "Physician"],
    ["Specialty", "Sports & Exercise Medicine"], ["Member no.", "M1·0426·1187"],
    ["Based in", "Dubai, UAE"], ["Issued", "OCT 2026"], ["Level", "One · Foundations"],
  ] as [string, string][],
  mrz: ["PM<M1<RAHMAN<<LEILA<<<<<<<<<<<<<<<<<<<<<<", "M104261187<M1<LEVEL<ONE<FOUNDATIONS<<<<<<<<"],
  qualifications: [
    ["Primary medical degree", "MBBS"],
    ["Postgraduate degree", "MSc Sports Medicine"],
    ["Specialty training", "Completed"],
  ] as [string, string][],
  license: [
    ["Professional licence", "On file"], ["Specialty register", "On file"], ["Verification", "Through M1 · planned"],
  ] as [string, string][],
  development: [
    ["Weekly faculty lecture", "Wk 01", "Attended"],
    ["Weekly faculty lecture", "Wk 02", "Attended"],
    ["Live Q&A session", "Wk 02", "Attended"],
    ["Quarterly half-day workshop", "Q1", "Attended"],
    ["Weekly faculty lecture", "Wk 14", "Attended"],
  ] as [string, string, string][],
  opportunities: [
    ["Mentorship pathways", "Matched guidance from practising faculty."],
    ["Research participation", "Cross-border study collaboration."],
    ["International community", "Regional circles and specialty forums."],
    ["Career development", "Pathways and records that travel with you."],
  ] as [string, string][],
  stamps: [
    { lines: ["M1 · Level One", "Foundations", "2026"], shape: "circle", color: "#9E4B26", x: 6, y: 4, r: -12 },
    { lines: ["Quarterly workshop", "Q1 · 2026"], shape: "rect", color: "#5B3D2A", x: 48, y: 12, r: 7 },
    { lines: ["Mentorship", "circle", "2026"], shape: "circle", color: "#8A6A3E", x: 50, y: 46, r: 14 },
    { lines: ["Live Q&A", "Week 02"], shape: "rect", color: "#B5532A", x: 6, y: 60, r: -6 },
  ] as Stamp[],
};
