"use client";

import { useRef } from "react";
import { dur, ease, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export type DrawStroke = { d: string; accent?: boolean };

export function DrawPath({
  paths,
  label = "Line drawing",
  viewBox = "0 0 400 160",
  className,
  delay = 0,
  duration = dur.cinematic,
  when = "scroll",
}: {
  paths: readonly (string | DrawStroke)[];
  label?: string;
  viewBox?: string;
  className?: string;
  /** Wait after the scroll trigger so a row of frames can draw in turn. */
  delay?: number;
  duration?: number;
  /** Scroll-triggered drawings stay the default. Mount plays as soon as the svg is on the page. */
  when?: "scroll" | "mount";
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || reducedMotion()) return;
      const strokes = Array.from(svg.querySelectorAll("path"));
      strokes.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.to(strokes, {
        strokeDashoffset: 0,
        duration,
        delay,
        ease: ease.inOut,
        stagger: stagger.base,
        scrollTrigger:
          when === "scroll"
            ? {
                trigger: svg,
                start: trigger.start,
                once: true,
              }
            : undefined,
      });
    },
    { scope: ref },
  );

  const classes = ["draw-path", className ?? ""].filter(Boolean).join(" ");

  return (
    <svg ref={ref} className={classes} viewBox={viewBox} fill="none" role="img" aria-label={label}>
      {paths.map((path) => {
        const d = typeof path === "string" ? path : path.d;
        const accent = typeof path === "string" ? false : Boolean(path.accent);
        return <path key={d} d={d} data-accent={accent ? "" : undefined} />;
      })}
    </svg>
  );
}
