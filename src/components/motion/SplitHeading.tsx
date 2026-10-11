"use client";

import { useRef, type ReactNode } from "react";
import { dur, ease, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p";

export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  note,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
  note?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const classes = ["split-heading", className ?? ""].filter(Boolean).join(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      let played = false;
      let tween: gsap.core.Tween | undefined;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          tween?.scrollTrigger?.kill();
          tween?.kill();
          if (played) {
            gsap.set(self.lines, { y: 0, yPercent: 0 });
            return;
          }
          gsap.set(self.lines, { y: 0, yPercent: 105 });
          tween = gsap.to(self.lines, {
            y: 0,
            yPercent: 0,
            duration: dur.slow,
            ease: ease.expo,
            stagger: stagger.base,
            scrollTrigger: {
              trigger: el,
              start: trigger.start,
              once: true,
            },
            onComplete() {
              played = true;
            },
          });
        },
      });
      return () => {
        tween?.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={classes}
      data-ph={note ? "" : undefined}
      data-ph-note={note}
      title={note}
    >
      {children}
    </Tag>
  );
}
