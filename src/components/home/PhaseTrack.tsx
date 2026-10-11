"use client";

import { useRef } from "react";
import { dur, ease, phaseMotion, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type PhaseItem = {
  status: "done" | "next" | "planned";
  label: string;
  detail: string;
  number?: number;
};

export function PhaseTrack({ phases }: { phases: readonly PhaseItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const doneCount = phases.filter((phase) => phase.status === "done").length;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion()) return;
      let timeline: gsap.core.Timeline | undefined;

      const play = () => {
        const rail = root.querySelector(".phase-rail");
        const bar = root.querySelector(".phase-rail-done");
        const here = root.querySelector(".phase-here");
        if (!(rail instanceof HTMLElement) || !(bar instanceof HTMLElement) || !(here instanceof HTMLElement)) return;

        const vertical = window.matchMedia("(max-width: 767px)").matches;
        const railBox = rail.getBoundingClientRect();
        const hereBox = here.getBoundingClientRect();
        const span = vertical ? railBox.height : railBox.width;
        const pos = vertical
          ? hereBox.top + hereBox.height / 2 - railBox.top
          : hereBox.left + hereBox.width / 2 - railBox.left;
        const ratio = span > 0 ? Math.min(Math.max(pos / span, 0.08), 0.92) : 0.3;

        gsap.set(bar, {
          transformOrigin: vertical ? "top center" : "left center",
          scaleX: vertical ? 1 : 0,
          scaleY: vertical ? 0 : 1,
        });

        const tl = gsap.timeline();
        timeline = tl;
        tl.to(
          bar,
          {
            scaleX: vertical ? 1 : ratio,
            scaleY: vertical ? ratio : 1,
            duration: phaseMotion.line,
            ease: ease.inOut,
          },
          0,
        );

        root.querySelectorAll(".phase-node[data-status='done']").forEach((node) => {
          const dot = node.querySelector(".phase-dot");
          const fill = node.querySelector(".phase-dot-fill");
          if (!(dot instanceof HTMLElement) || !fill) return;
          const box = dot.getBoundingClientRect();
          const at = vertical
            ? (box.top + box.height / 2 - railBox.top) / span
            : (box.left + box.width / 2 - railBox.left) / span;
          const when = ratio > 0 ? Math.max(0, Math.min(at / ratio, 1)) * phaseMotion.line : 0;
          tl.to(fill, { scale: 1, duration: dur.fast, ease: ease.out }, when);
        });

        const future = root.querySelectorAll(".phase-node[data-status='next'], .phase-node[data-status='planned']");
        tl.fromTo(
          future,
          { opacity: 0 },
          { opacity: 1, duration: dur.base, ease: ease.out, stagger: stagger.base },
          phaseMotion.line,
        );
        tl.fromTo(here, { opacity: 0 }, { opacity: 1, duration: dur.fast, ease: ease.out }, phaseMotion.line * 0.92);
        const pulse = here.querySelector(".phase-here-pulse");
        if (pulse) {
          tl.fromTo(
            pulse,
            { scale: 1, opacity: 0.7 },
            { scale: 1.45, opacity: 0, duration: dur.slow, ease: ease.out, repeat: -1 },
            phaseMotion.line,
          );
        }
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start: trigger.start,
        once: true,
        onEnter: play,
      });

      return () => {
        st.kill();
        timeline?.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="phase-track" ref={rootRef}>
      <span className="phase-rail" aria-hidden="true" />
      <span className="phase-rail-done" aria-hidden="true" />
      <ol className="phase-list">
        {phases.flatMap((phase, index) => {
          const node = (
            <li key={phase.label} className="phase-node" data-status={phase.status}>
              <span className="phase-dot">
                <span className="phase-dot-fill" aria-hidden="true" />
                {phase.number ? <span className="phase-num">{phase.number}</span> : null}
              </span>
              <span className="phase-copy">
                <span className="phase-label">{phase.label}</span>
                <span className="phase-detail">{phase.detail}</span>
              </span>
            </li>
          );
          if (index !== doneCount) return [node];
          return [
            <li key="here" className="phase-here">
              <span className="phase-here-pulse" aria-hidden="true" />
              We are here
            </li>,
            node,
          ];
        })}
      </ol>
    </div>
  );
}
