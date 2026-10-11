"use client";

import { useRef, type ReactNode } from "react";
import { dur, ease, rise, stagger as staggerTokens, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export function Reveal({
  children,
  delay = 0,
  stagger,
  className,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: boolean | number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      const step = stagger === true ? staggerTokens.base : typeof stagger === "number" ? stagger : 0;
      const targets = step > 0 ? Array.from(root.children) : [root];
      if (targets.length === 0) return;
      gsap.fromTo(
        targets,
        { opacity: 0, y: rise.md },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: dur.slow,
          ease: ease.out,
          stagger: step > 0 ? step : 0,
          scrollTrigger: {
            trigger: root,
            start: trigger.start,
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  const classes = ["reveal", stagger ? "reveal-stagger" : "reveal-item", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
