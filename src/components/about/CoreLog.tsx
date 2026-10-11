"use client";

import { useRef } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Subheading } from "@/components/type/Subheading";
import { aboutStory, coreDepths, coreRocks } from "@/content/about";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

export function CoreLog() {
  const scope = useRef<HTMLDivElement>(null);
  useTagline(aboutStory.title);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || reducedMotion()) return;

      const core = root.querySelector<HTMLElement>(".core-cylinder");
      const ring = root.querySelector<HTMLElement>(".core-ring");
      const list = root.querySelector<HTMLElement>(".core-chapters");
      const chapters = gsap.utils.toArray<HTMLElement>(".core-chapter", root);
      const segments = gsap.utils.toArray<HTMLElement>(".core-segment", root);
      if (!core || !ring || !list || chapters.length === 0 || segments.length === 0) return;

      const place = (progress: number) => {
        const travel = Math.max(core.clientHeight - ring.offsetHeight, 0);
        const y = progress * travel;
        gsap.set(ring, { y });
        const center = y + ring.offsetHeight / 2;
        let index = 0;
        let best = Number.POSITIVE_INFINITY;
        segments.forEach((segment, i) => {
          const mid = segment.offsetTop + segment.offsetHeight / 2;
          const dist = Math.abs(center - mid);
          if (dist < best) {
            best = dist;
            index = i;
          }
        });
        chapters.forEach((chapter, i) => chapter.classList.toggle("is-active", i === index));
        segments.forEach((segment, i) => segment.classList.toggle("is-lit", i === index));
      };

      place(0);

      const tween = gsap.to(
        { p: 0 },
        {
          p: 1,
          ease: ease.scrub,
          scrollTrigger: {
            trigger: list,
            start: "top 55%",
            end: "bottom 60%",
            scrub: 0.5,
            onUpdate(self) {
              place(self.progress);
            },
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope },
  );

  return (
    <Section tone="ink-2" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{aboutStory.eyebrow}</Eyebrow>
          <SplitHeading>{aboutStory.title}</SplitHeading>
        </div>
        <div className="core-layout" ref={scope}>
          <div className="core-pin">
            <div className="core-stage" aria-hidden="true">
              <div className="core-scale">
                {coreRocks.map((rock, index) => (
                  <div key={rock.code} className="core-scale-row" style={{ flexGrow: rock.share }}>
                    <span className="core-depth-label">{coreDepths[index]} m</span>
                  </div>
                ))}
                <span className="core-scale-end">{coreDepths[coreDepths.length - 1]} m</span>
              </div>
              <div className="core-well">
                <div className="core-cylinder">
                  {coreRocks.map((rock, index) => (
                    <div
                      key={rock.code}
                      className={index === 0 ? "core-segment is-lit" : "core-segment"}
                      style={{ background: rock.color, flexGrow: rock.share }}
                    />
                  ))}
                  <div className="core-sheen" />
                  <svg className="core-noise" aria-hidden="true">
                    <filter id="about-core-grain">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.85"
                        numOctaves="2"
                        stitchTiles="stitch"
                      />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#about-core-grain)" />
                  </svg>
                </div>
                <div className="core-ring" />
              </div>
            </div>
          </div>
          <ol className="core-chapters">
            {aboutStory.chapters.map((chapter, index) => (
              <li key={chapter.depth} className={index === 0 ? "core-chapter is-active" : "core-chapter"}>
                <span className="core-range">{chapter.depth}</span>
                <Subheading>{chapter.title}</Subheading>
                {chapter.paragraphs.map((paragraph) => (
                  <Body key={typeof paragraph === "string" ? paragraph.slice(0, 24) : paragraph.text.slice(0, 24)}>
                    <Copy value={paragraph} />
                  </Body>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
