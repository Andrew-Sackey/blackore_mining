"use client";

import { useRef, type ReactNode } from "react";
import { clip, dur, ease, scale, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const classes = ["image-reveal", className ?? ""].filter(Boolean).join(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const phone = window.matchMedia("(max-width: 767px)").matches;
      gsap.fromTo(
        el,
        { clipPath: phone ? clip.fromPhone : clip.from, scale: scale.image },
        {
          clipPath: phone ? clip.toPhone : clip.to,
          scale: 1,
          duration: dur.slow,
          ease: ease.out,
          scrollTrigger: {
            trigger: el,
            start: trigger.start,
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
