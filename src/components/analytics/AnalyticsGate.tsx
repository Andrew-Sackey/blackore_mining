"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function AnalyticsGate() {
  if (process.env.NEXT_PUBLIC_ANALYTICS !== "on") return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
