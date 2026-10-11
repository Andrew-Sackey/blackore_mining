import type { NextConfig } from "next";

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST?.replace(/\/$/, "") ?? "";

function mediaOrigin() {
  if (!mediaHost) return "";
  try {
    return new URL(mediaHost).origin;
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: mediaHost
      ? [
          {
            protocol: "https",
            hostname: new URL(mediaHost).hostname,
          },
        ]
      : [],
  },
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    const production = process.env.NODE_ENV === "production";
    const indexable = process.env.VERCEL_ENV === "production";
    const origin = mediaOrigin();
    const scriptSrc = production
      ? "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com";
    const connectSrc = [
      "connect-src 'self'",
      "https://formspree.io",
      "https://va.vercel-scripts.com",
      "https://vitals.vercel-insights.com",
      production ? "" : "ws: wss:",
    ]
      .filter(Boolean)
      .join(" ");
    const imgSrc = ["img-src 'self' data: blob:", origin].filter(Boolean).join(" ");
    const mediaSrc = ["media-src 'self'", origin].filter(Boolean).join(" ");
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      imgSrc,
      mediaSrc,
      "font-src 'self'",
      connectSrc,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
    ].join("; ");

    const headers = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      { key: "X-Frame-Options", value: "DENY" },
    ];
    if (!indexable) headers.push({ key: "X-Robots-Tag", value: "noindex" });
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
