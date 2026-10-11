"use client";

import { useRef, type ReactNode } from "react";
import { ease, scrollWords } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Tag = "h2" | "p";

export function ScrollWords({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const classes = ["scroll-words", className ?? ""].filter(Boolean).join(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      let tween: gsap.core.Tween | undefined;
      const split = SplitText.create(el, {
        type: "words",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          tween?.scrollTrigger?.kill();
          tween?.kill();
          gsap.set(self.words, { opacity: scrollWords.dim });
          tween = gsap.to(self.words, {
            opacity: 1,
            ease: ease.scrub,
            stagger: { each: 0.08 },
            scrollTrigger: {
              trigger: el,
              start: scrollWords.start,
              end: scrollWords.end,
              scrub: scrollWords.scrub,
            },
          });
        },
      });
      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
