"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { dur, ease, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

function format(value: number, decimals: number) {
  return value.toFixed(decimals);
}

export type CountUpHandle = { play: () => void };

export const CountUp = forwardRef<
  CountUpHandle,
  { value: number; decimals?: number; suffix?: string; when?: "view" | "manual" }
>(function CountUp({ value, decimals = 0, suffix = "", when = "view" }, handle) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalText = `${format(value, decimals)}${suffix}`;
  const playRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const el = ref.current;
      const run = () => {
        if (!el || reducedMotion()) return;
        const state = { n: 0 };
        el.textContent = `${format(0, decimals)}${suffix}`;
        gsap.to(state, {
          n: value,
          duration: dur.cinematic,
          ease: ease.out,
          scrollTrigger:
            when === "view"
              ? {
                  trigger: el,
                  start: trigger.start,
                  once: true,
                }
              : undefined,
          onUpdate() {
            el.textContent = `${format(state.n, decimals)}${suffix}`;
          },
        });
      };
      playRef.current = run;
      if (!el || reducedMotion()) return;
      if (when === "manual") {
        el.textContent = `${format(0, decimals)}${suffix}`;
        return;
      }
      run();
    },
    { scope: ref },
  );

  useImperativeHandle(handle, () => ({ play: () => playRef.current() }));

  return (
    <span className="count-up" role="img" aria-label={finalText}>
      <span ref={ref} className="count-up-value" aria-hidden="true">
        {finalText}
      </span>
      <span className="count-up-sizer" aria-hidden="true">
        {finalText}
      </span>
    </span>
  );
});
