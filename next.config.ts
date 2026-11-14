import type { NextConfig } from "next";

/* STATIC_EXPORT=1 builds plain HTML/CSS/JS into ./out (for static hosting such as
   Hostinger shared plans or S3 + CloudFront). Without it, the app runs with `next start`. */
const staticExport = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  ...(staticExport
    ? { output: "export" as const, trailingSlash: true }
    : {
        async headers() {
          return [
            { source: "/:path*", headers: securityHeaders },
            // Images in /public keep their file names, so cache them for a week, not forever.
            ...(process.env.NODE_ENV === "production"
              ? [
                  {
                    source: "/img/:path*",
                    headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
                  },
                ]
              : []),
          ];
        },
      }),
};

export default nextConfig;
