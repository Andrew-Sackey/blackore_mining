"use client";

import { useRef, type ReactNode } from "react";
import { ease, parallax as parallaxToken } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export function Parallax({
  speed = -0.12,
  children,
  className,
}: {
  speed?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const classes = ["parallax", className ?? ""].filter(Boolean).join(" ");

  useGSAP(
    () => {
      const root = ref.current;
      const child = root?.firstElementChild;
      if (!root || !child || reducedMotion()) return;
      const touchPhone = window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;
      if (touchPhone) return;
      const amount = Math.min(Math.abs(speed), parallaxToken.max);
      const sign = speed < 0 ? -1 : 1;
      gsap.fromTo(
        child,
        { y: () => -sign * amount * root.offsetHeight },
        {
          y: () => sign * amount * root.offsetHeight,
          ease: ease.scrub,
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
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
