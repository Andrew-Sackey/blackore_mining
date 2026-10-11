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
import { aboutPrinciples } from "@/content/about";
import { gsap, useGSAP } from "@/lib/gsap";
import { dur, ease, rise, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

export function Principles() {
  const scope = useRef<HTMLDivElement>(null);
  useTagline(aboutPrinciples.title);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || reducedMotion()) return;
      const items = gsap.utils.toArray<HTMLElement>(".principle", root);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: trigger.start,
          once: true,
        },
      });
      items.forEach((item, index) => {
        const line = item.querySelector(".principle-line");
        const copy = item.querySelector(".principle-copy");
        const at = index * stagger.base * 4;
        if (line) {
          timeline.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, duration: dur.fast, ease: ease.out },
            at,
          );
        }
        if (copy) {
          timeline.fromTo(
            copy,
            { opacity: 0, y: rise.sm },
            { opacity: 1, y: 0, duration: dur.base, ease: ease.out },
            at + dur.fast * 0.65,
          );
        }
      });
      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope },
  );

  return (
    <Section tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{aboutPrinciples.eyebrow}</Eyebrow>
          <SplitHeading>{aboutPrinciples.title}</SplitHeading>
        </div>
        <div className="principle-grid" ref={scope}>
          {aboutPrinciples.items.map((item, index) => (
            <article key={item.title} className="principle">
              <div className="principle-copy">
                <span className="principle-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Subheading>{item.title}</Subheading>
                <Body>
                  <Copy value={item.body} />
                </Body>
              </div>
              <span className="principle-line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
