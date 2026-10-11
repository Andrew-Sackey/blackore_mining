"use client";

import type { RefObject } from "react";
import { BLACKORE, COPPER_GRADIENT, GLOBE, LOGO_VIEWBOX, MARK, MINING } from "@/components/brand/logo-paths";

export type AnimatedLogoRefs = {
  svg: RefObject<SVGSVGElement | null>;
  mark: RefObject<SVGGElement | null>;
  mining: RefObject<SVGGElement | null>;
  reveal: RefObject<SVGRectElement | null>;
  head: RefObject<SVGCircleElement | null>;
  sheen: RefObject<SVGGElement | null>;
  sheenGrad: RefObject<SVGLinearGradientElement | null>;
  globe: RefObject<SVGGElement | null>;
  oShape: RefObject<SVGPathElement | null>;
  front: RefObject<SVGPathElement | null>;
  back: RefObject<SVGPathElement | null>;
  dot: RefObject<SVGCircleElement | null>;
  ping: RefObject<SVGCircleElement | null>;
};

const markPaths = [MARK.tail, MARK.lowBand, MARK.highStroke];
const oLetter = BLACKORE[5];

export function AnimatedLogo({
  svgRef,
  markRef,
  miningRef,
  revealRef,
  headRef,
  sheenRef,
  sheenGradRef,
  globeRef,
  oShapeRef,
  frontRef,
  backRef,
  dotRef,
  pingRef,
}: {
  svgRef: AnimatedLogoRefs["svg"];
  markRef: AnimatedLogoRefs["mark"];
  miningRef: AnimatedLogoRefs["mining"];
  revealRef: AnimatedLogoRefs["reveal"];
  headRef: AnimatedLogoRefs["head"];
  sheenRef: AnimatedLogoRefs["sheen"];
  sheenGradRef: AnimatedLogoRefs["sheenGrad"];
  globeRef: AnimatedLogoRefs["globe"];
  oShapeRef: AnimatedLogoRefs["oShape"];
  frontRef: AnimatedLogoRefs["front"];
  backRef: AnimatedLogoRefs["back"];
  dotRef: AnimatedLogoRefs["dot"];
  pingRef: AnimatedLogoRefs["ping"];
}) {
  return (
    <svg
      ref={svgRef}
      className="intro-logo"
      viewBox={LOGO_VIEWBOX}
      role="img"
      aria-label="BlackOre Mining"
    >
      <defs>
        <linearGradient
          id="bo-cu"
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
        <linearGradient id="bo-sheen" ref={sheenGradRef} gradientUnits="userSpaceOnUse" x1={-260} y1={0} x2={-60} y2={0}>
          <stop offset="0" stopColor="#FFF4E6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF4E6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF4E6" stopOpacity="0" />
        </linearGradient>
        <clipPath id="bo-reveal">
          <rect ref={revealRef} x="30" y="-20" width="0" height="240" />
        </clipPath>
        <clipPath id="bo-letters">
          <rect x="0" y="145" width="800" height="38" />
        </clipPath>
        <radialGradient id="bo-sphere" cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#3A2A1E" />
          <stop offset="0.55" stopColor="#120D0A" />
          <stop offset="1" stopColor="#030303" />
        </radialGradient>
        <filter id="bo-glow" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g ref={markRef}>
        <g clipPath="url(#bo-reveal)">
          <g fill="url(#bo-cu)">
            {markPaths.map((d) => (
              <path key={d.slice(0, 12)} d={d} />
            ))}
          </g>
          <g ref={sheenRef} fill="url(#bo-sheen)" opacity="0">
            {markPaths.map((d) => (
              <path key={`sheen-${d.slice(0, 12)}`} d={d} />
            ))}
          </g>
        </g>
        <circle ref={headRef} r="1.9" fill="#FFF1E0" filter="url(#bo-glow)" opacity="0" />
      </g>

      <g clipPath="url(#bo-letters)">
        {BLACKORE.map((letter) =>
          letter.char === "O" ? (
            <g className="letter" key="O">
              <path ref={oShapeRef} id="oShape" fill="#F5F5F7" fillRule="evenodd" opacity="0" d={oLetter.d} />
              <g ref={globeRef}>
                <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.sphereR} fill="url(#bo-sphere)" />
                <path ref={backRef} fill="none" stroke="rgba(245,245,247,.13)" strokeWidth="0.3" />
                <path ref={frontRef} fill="none" stroke="rgba(245,245,247,.7)" strokeWidth="0.45" strokeLinejoin="round" />
                <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.rimR} fill="none" stroke="#F5F5F7" strokeWidth={GLOBE.rimStroke} />
                <circle ref={pingRef} r="1.3" fill="none" stroke="#E3A56C" strokeWidth="0.5" opacity="0" />
                <circle ref={dotRef} r="1.25" fill="#E3A56C" />
              </g>
            </g>
          ) : (
            <g className="letter" key={letter.char}>
              <path fill="#F5F5F7" fillRule="evenodd" d={letter.d} />
            </g>
          ),
        )}
      </g>

      <g ref={miningRef}>
        {MINING.map((letter, index) => (
          <path key={`${letter.char}-${index}`} className="mi" fill="#F5F5F7" d={letter.d} />
        ))}
      </g>
    </svg>
  );
}
