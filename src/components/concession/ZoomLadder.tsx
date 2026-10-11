"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { DrawPath } from "@/components/motion/DrawPath";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { regional } from "@/content/concession";
import { CONCESSION_PATH, CONCESSION_VIEWBOX, PILLARS } from "@/content/geo/concession-boundary";
import { CONCESSION_MARKER, GHANA_OUTLINE, GHANA_VIEWBOX, TOWNS, project } from "@/content/geo/ghana-map";
import { gsap } from "@/lib/gsap";
import { dur, ease, rise, zoomLadder } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

const KM_PER_X =
  (111.32 * Math.cos((7.65 * Math.PI) / 180)) / (120 * Math.cos((8 * Math.PI) / 180));
const KM_PER_Y = 111.32 / 120;
const HALF_X = 20 / KM_PER_X;
const HALF_Y = 20 / KM_PER_Y;

const windowBox = {
  x: CONCESSION_MARKER.x - HALF_X,
  y: CONCESSION_MARKER.y - HALF_Y,
  w: HALF_X * 2,
  h: HALF_Y * 2,
};

const projected = PILLARS.map((pillar) => project(pillar.lon, pillar.lat));
const concessionD = `${projected
  .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
  .join("")}Z`;

const minX = Math.min(...projected.map(([x]) => x));
const maxX = Math.max(...projected.map(([x]) => x));
const minY = Math.min(...projected.map(([, y]) => y));
const maxY = Math.max(...projected.map(([, y]) => y));
const insetD = `M${minX.toFixed(1)} ${minY.toFixed(1)}H${maxX.toFixed(1)}V${maxY.toFixed(1)}H${minX.toFixed(1)}Z`;
const windowD = `M${windowBox.x.toFixed(1)} ${windowBox.y.toFixed(1)}H${(windowBox.x + windowBox.w).toFixed(1)}V${(windowBox.y + windowBox.h).toFixed(1)}H${windowBox.x.toFixed(1)}Z`;

const ladderTowns = new Set(["Wenchi", "Techiman", "Sunyani"]);
const townsInside = TOWNS.filter(
  (town) =>
    ladderTowns.has(town.name) &&
    town.x >= windowBox.x &&
    town.x <= windowBox.x + windowBox.w &&
    town.y >= windowBox.y &&
    town.y <= windowBox.y + windowBox.h,
);

const frames = [
  {
    caption: "Ghana · 238,500 km²",
    viewBox: GHANA_VIEWBOX,
    paths: [GHANA_OUTLINE, { d: windowD, accent: true }],
  },
  {
    caption: "Wenchi Municipal District",
    viewBox: `${windowBox.x} ${windowBox.y} ${windowBox.w} ${windowBox.h}`,
    paths: [concessionD, { d: insetD, accent: true }],
  },
  {
    caption: "Badu concession · 41.09 km²",
    viewBox: CONCESSION_VIEWBOX,
    paths: [CONCESSION_PATH],
  },
] as const;

export function ZoomLadder() {
  const root = useRef<HTMLDivElement>(null);
  useTagline(regional.title);

  useGSAP(
    () => {
      const node = root.current;
      if (!node || reducedMotion()) return;
      const mm = gsap.matchMedia();
      const leaderTrigger = { trigger: node, start: "top 80%", once: true };
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".zoom-leader",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: dur.base,
            stagger: zoomLadder.stagger,
            ease: ease.out,
            scrollTrigger: leaderTrigger,
          },
        );
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".zoom-leader",
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: dur.base,
            stagger: zoomLadder.stagger,
            ease: ease.out,
            scrollTrigger: leaderTrigger,
          },
        );
      });
      gsap.fromTo(
        ".zoom-step",
        { opacity: 0, y: rise.sm },
        {
          opacity: 1,
          y: 0,
          duration: dur.slow,
          stagger: zoomLadder.stagger,
          ease: ease.out,
          scrollTrigger: { trigger: node, start: "top 80%", once: true },
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Section id="regional" tone="ink-2" space="lg">
      <Container>
        <div className="regional-grid">
          <div className="section-intro">
            <Eyebrow>{regional.eyebrow}</Eyebrow>
            <SplitHeading>{regional.title}</SplitHeading>
            {regional.paragraphs.map((paragraph) => (
              <Body key={paragraph}>{paragraph}</Body>
            ))}
          </div>
          <div ref={root} className="zoom-ladder">
            {frames.map((frame, index) => (
              <div className="zoom-slot" key={frame.caption}>
                {index > 0 && <span className="zoom-leader" aria-hidden="true" />}
                <figure className="zoom-step">
                  <div className="zoom-frame">
                    {index === 0 && (
                      <svg className="zoom-base" viewBox={GHANA_VIEWBOX} aria-hidden="true">
                        <circle className="zoom-pulse" cx={CONCESSION_MARKER.x} cy={CONCESSION_MARKER.y} r="4" />
                        <circle className="zoom-pulse-ring" cx={CONCESSION_MARKER.x} cy={CONCESSION_MARKER.y} r="8" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="zoom-base" viewBox={frame.viewBox} aria-hidden="true">
                        <path className="zoom-fill" d={concessionD} />
                        {townsInside.map((town) => (
                          <g key={town.name}>
                            <circle className="zoom-town" cx={town.x} cy={town.y} r="1.6" />
                            <text x={town.x + 2.2} y={town.y - 1.6}>
                              {town.name}
                            </text>
                          </g>
                        ))}
                      </svg>
                    )}
                    <DrawPath
                      paths={frame.paths}
                      viewBox={frame.viewBox}
                      label={frame.caption}
                      delay={index * zoomLadder.stagger}
                    />
                  </div>
                  <Caption as="figcaption" className="is-sentence">
                    {frame.caption}
                  </Caption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
