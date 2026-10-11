"use client";

import { useId } from "react";
import {
  BLACKORE,
  COPPER_GRADIENT,
  LOGO_VIEWBOX,
  LOGO_VIEWBOX_STACKED,
  MARK,
  MINING,
  STACKED,
} from "@/components/brand/logo-paths";

type Variant = "horizontal" | "stacked" | "mark";

type LogoProps = {
  variant?: Variant;
  className?: string;
  /** Hide from assistive tech when a parent link already names the logo. */
  decorative?: boolean;
};

function CopperGradient({ id }: { id: string }) {
  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={COPPER_GRADIENT.x1}
      y1={COPPER_GRADIENT.y1}
      x2={COPPER_GRADIENT.x2}
      y2={COPPER_GRADIENT.y2}
    >
      {COPPER_GRADIENT.stops.map((stop) => (
        <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
      ))}
    </linearGradient>
  );
}

function MarkPaths({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <path d={MARK.tail} />
      <path d={MARK.lowBand} />
      <path d={MARK.highStroke} />
    </g>
  );
}

function Wordmark() {
  return (
    <g fill="#F5F5F7" fillRule="evenodd">
      {BLACKORE.map((letter) => (
        <path key={letter.char} d={letter.d} />
      ))}
    </g>
  );
}

function MiningWord() {
  return (
    <g fill="#F5F5F7">
      {MINING.map((letter, index) => (
        <path key={`${letter.char}-${index}`} d={letter.d} />
      ))}
    </g>
  );
}

export function Logo({ variant = "horizontal", className, decorative = false }: LogoProps) {
  const rawId = useId().replace(/:/g, "");
  const gradientId = `cu${rawId}`;
  const clipId = `mk${rawId}`;
  const labelling = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": "BlackOre Mining" } as const);

  if (variant === "mark") {
    return (
      <svg viewBox="576 -36.5 225 225" className={className} {...labelling}>
        <defs>
          <CopperGradient id={gradientId} />
          <clipPath id={clipId}>
            <rect x="585" y="0" width="300" height="160" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <MarkPaths fill={`url(#${gradientId})`} />
        </g>
      </svg>
    );
  }

  if (variant === "stacked") {
    return (
      <svg viewBox={LOGO_VIEWBOX_STACKED} className={className} {...labelling}>
        <defs>
          <CopperGradient id={gradientId} />
        </defs>
        <g transform={`translate(${STACKED.mark.x} ${STACKED.mark.y}) scale(${STACKED.mark.scale})`}>
          <MarkPaths fill={`url(#${gradientId})`} />
        </g>
        <Wordmark />
        <g transform={`translate(${STACKED.mining.x} ${STACKED.mining.y})`}>
          <MiningWord />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} {...labelling}>
      <defs>
        <CopperGradient id={gradientId} />
      </defs>
      <MarkPaths fill={`url(#${gradientId})`} />
      <Wordmark />
      <MiningWord />
    </svg>
  );
}
