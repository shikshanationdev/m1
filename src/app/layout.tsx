import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { M1_SPRITE } from "@/components/m1/sprite";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const TITLE = "M1 | The Single Platform for the World's Doctors";
const DESCRIPTION =
  "Discover M1, a global medical education and professional-development ecosystem connecting learning, mentorship, medical expertise and lifelong career progression.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "M One Global Medical Education",
    images: [{ url: "/img/faculty/george-john-hero.webp", width: 1100, height: 1100, alt: "Dr. George John, Founder and President of M One" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/faculty/george-john-hero.webp"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#140805",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "M One Global Medical Education",
  alternateName: "M1",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${manrope.variable} ${plex.variable}`}>
      <head>
        <link rel="preload" as="image" href="/img/faculty/george-john-hero.webp" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {/* logo symbols + gradients referenced across the page with <use href="#m1-..."> */}
        <div aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: M1_SPRITE }} />
        {children}
      </body>
    </html>
  );
}
