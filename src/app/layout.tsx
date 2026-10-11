import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import Script from "next/script";
import { IntroProvider } from "@/components/intro/IntroContext";
import { PlaceholderHotkey } from "@/components/content/PlaceholderHotkey";
import { PathMemory } from "@/components/contact/PathMemory";
import { AnalyticsGate } from "@/components/analytics/AnalyticsGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteNav } from "@/components/nav/SiteNav";
import { isPlaceholder, type CopyValue } from "@/content/placeholder";
import { contact } from "@/content/site";
import { homeDescription, homeMetadata, homeTitle, indexable, siteUrl } from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "BlackOre Mining",
  authors: [{ name: "BlackOre Mining Ltd" }],
  creator: "BlackOre Mining Ltd",
  formatDetection: { telephone: false },
  title: {
    default: homeTitle,
    template: "%s · BlackOre Mining",
  },
  description: homeDescription,
  alternates: { canonical: "/" },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: homeMetadata.openGraph,
  twitter: homeMetadata.twitter,
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

const organization: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlackOre Mining",
  url: siteUrl,
  logo: `${siteUrl}/icons/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "GH",
  },
};

const email: CopyValue = contact.email;
if (!isPlaceholder(email)) organization.email = email;

const introBootstrap = `
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("is-reduced"); } catch (e) {}
  var path = location.pathname.replace(/\\/$/, "") || "/";
  var mode = "none";
  if (path === "/") {
    var reduce = false;
    try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    var seen = false;
    try { seen = sessionStorage.getItem("bo-intro-seen") === "1"; } catch (e) {}
    mode = reduce ? "none" : seen ? "short" : "full";
    try { if (innerWidth < 640) root.classList.add("is-stacked"); } catch (e) {}
  }
  root.setAttribute("data-intro", mode);
  window.__BO_INTRO__ = mode;
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${michroma.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <Script id="bo-intro-mode" strategy="beforeInteractive">
          {introBootstrap}
        </Script>
        <noscript>
          <style>{`
            .intro { display: none !important; }
            .nav-logo svg { visibility: visible !important; }
            [data-reveal], [data-hero], [data-stat], [data-line],
            .reveal-item, .reveal-stagger > *, .image-reveal, .page-hero-media, .split-heading {
              opacity: 1 !important;
              transform: none !important;
              clip-path: none !important;
            }
            .hero-media { transform: none !important; }
          `}</style>
        </noscript>
        <PlaceholderHotkey />
        <SmoothScroll>
          <IntroProvider>
            <SiteNav />
            <div id="page-root">
              <div id="content" tabIndex={-1}>
                {children}
              </div>
              <PathMemory />
              <SiteFooter />
            </div>
          </IntroProvider>
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <AnalyticsGate />
      </body>
    </html>
  );
}
