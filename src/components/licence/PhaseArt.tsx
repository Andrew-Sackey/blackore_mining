"use client";

import { useRef } from "react";
import { dur, ease, stagger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { phaseArtwork } from "@/components/licence/phase-art";

function setDash(path: SVGPathElement) {
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
}

export function PhaseArt({ phase }: { phase: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const art = phaseArtwork;

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || reducedMotion()) return;

      const draws = Array.from(svg.querySelectorAll<SVGPathElement>("[data-draw]"));
      draws.forEach(setDash);

      const timeline = gsap.timeline();

      if (phase === 1 && draws.length) {
        timeline.to(draws, {
          strokeDashoffset: 0,
          duration: dur.base,
          ease: ease.inOut,
          stagger: dur.fast,
        });
        const diamonds = svg.querySelectorAll("[data-diamond]");
        timeline.fromTo(
          diamonds,
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: dur.fast, ease: ease.out, stagger: stagger.base },
          dur.fast,
        );
      }

      if (phase === 2) {
        const lines = svg.querySelectorAll("[data-dot-line]");
        const step = lines.length > 0 ? dur.cinematic / lines.length : dur.cinematic;
        timeline.to(lines, { opacity: 1, duration: step, stagger: step, ease: ease.out }, 0);
        timeline.to(
          svg.querySelectorAll("[data-blob]"),
          { opacity: 1, duration: dur.base, stagger: stagger.base, ease: ease.out },
        );
        timeline.to(svg.querySelector("[data-infill]"), { opacity: 1, duration: dur.fast, ease: ease.out }, "-=0.3");
      }

      if (phase === 3 && draws.length) {
        timeline.to(draws, {
          strokeDashoffset: 0,
          duration: dur.base,
          ease: ease.inOut,
          stagger: stagger.base,
        });
        const rings = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-ring]"));
        rings.forEach((ring) => {
          const length = 2 * Math.PI * ring.r.baseVal.value;
          gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
        });
        timeline.to(rings, {
          strokeDashoffset: 0,
          duration: dur.fast,
          ease: ease.out,
          stagger: stagger.tight,
        });
      }

      if (phase === 4 && draws.length) {
        timeline.to(draws, {
          strokeDashoffset: 0,
          duration: dur.base,
          ease: ease.inOut,
          stagger: stagger.tight,
        });
        timeline.fromTo(
          svg.querySelectorAll("[data-collar]"),
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration: dur.fast, ease: ease.out, stagger: stagger.tight },
          0.15,
        );
      }
      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: [phase] },
  );

  const phaseName = ["", "reconnaissance", "geochemistry", "target definition", "discovery drilling"][phase] ?? "this phase";

  return (
    <svg
      ref={ref}
      className="phase-art"
      viewBox="0 0 1000 844"
      role="img"
      aria-label={`Illustration of ${phaseName} on the concession boundary. Not actual data.`}
    >
      <defs>
        <clipPath id="licence-boundary-clip" clipPathUnits="userSpaceOnUse">
          <path d={art.boundary} />
        </clipPath>
        <radialGradient id="licence-anomaly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-copper)" stopOpacity="0.55" />
          <stop offset="70%" stopColor="var(--color-copper)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-copper)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className="phase-boundary" d={art.boundary} />
      <g clipPath="url(#licence-boundary-clip)">
        {phase === 1
          ? art.traverses.map((d) => <path key={d} d={d} data-draw="" />)
          : null}
        {phase === 1
          ? art.diamonds.map((d) => <path key={d} className="phase-diamond" d={d} data-diamond="" />)
          : null}
        {phase === 2
          ? art.sampleLines.map((d, index) => <path key={index} className="phase-dots" d={d} data-dot-line="" />)
          : null}
        {phase >= 2
          ? art.blobs.map((blob) => (
              <ellipse
                key={`${blob.cx}-${blob.cy}`}
                data-blob={phase === 2 ? "" : undefined}
                className="phase-blob"
                cx={blob.cx}
                cy={blob.cy}
                rx={blob.rx}
                ry={blob.ry}
                fill="url(#licence-anomaly)"
                transform={`rotate(${blob.rotate} ${blob.cx} ${blob.cy})`}
              />
            ))
          : null}
        {phase === 2 && art.infill ? <path className="phase-infill" d={art.infill} data-infill="" /> : null}
        {phase === 3
          ? art.trenches.map((d) => <path key={d} d={d} data-draw="" data-accent="" />)
          : null}
        {phase === 3
          ? art.rings.map((ring) => (
              <circle key={`${ring.x}-${ring.y}`} data-ring="" cx={ring.x} cy={ring.y} r={6} />
            ))
          : null}
        {phase === 4
          ? art.holes.map((hole) => <path key={hole.d} d={hole.d} data-draw="" data-accent="" />)
          : null}
        {phase === 4
          ? art.holes.map((hole) => (
              <circle key={`${hole.x}-${hole.y}`} data-collar="" className="phase-collar" cx={hole.x} cy={hole.y} r={4.5} />
            ))
          : null}
      </g>
    </svg>
  );
}
