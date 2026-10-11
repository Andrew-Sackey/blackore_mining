"use client";

import { useRef } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { Subheading } from "@/components/type/Subheading";
import { licenceTimeline } from "@/content/licence";
import { ease } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export function MilestoneSpine() {
  const rootRef = useRef<HTMLDivElement>(null);
  useTagline(licenceTimeline.title);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion()) return;
      const fill = root.querySelector(".spine-fill");
      const spine = root.querySelector<HTMLElement>(".spine");
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(".mile-node"));
      const items = Array.from(root.querySelectorAll<HTMLElement>(".mile"));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!fill || !spine || !first || !last) return;

      const place = () => {
        const rail = root.getBoundingClientRect();
        const start = first.getBoundingClientRect();
        const end = last.getBoundingClientRect();
        const top = start.top + start.height / 2 - rail.top;
        const bottom = end.top + end.height / 2 - rail.top;
        spine.style.top = `${top}px`;
        spine.style.height = `${Math.max(bottom - top, 0)}px`;
      };
      place();

      gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });

      const trigger = gsap.to(fill, {
        scaleY: 1,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: first,
          start: "center 70%",
          endTrigger: last,
          end: "center 50%",
          scrub: 0.5,
          onRefresh: place,
          onUpdate(self) {
            const start = first.getBoundingClientRect();
            const end = last.getBoundingClientRect();
            const span = end.top - start.top || 1;
            nodes.forEach((node, index) => {
              const box = node.getBoundingClientRect();
              const ratio = (box.top - start.top) / span;
              const reached = self.progress >= ratio - 0.02;
              node.classList.toggle("is-lit", reached);
              const item = items[index];
              item?.classList.toggle("is-reached", reached);
              if (item?.dataset.future !== undefined) gsap.set(item, { opacity: reached ? 1 : 0.6 });
            });
          },
        },
      });

      return () => {
        trigger.scrollTrigger?.kill();
        trigger.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <Section tone="ink-2" space="lg">
      <Container>
        <div className="mile-grid">
          <div className="mile-intro">
            <div className="section-intro">
              <Eyebrow>{licenceTimeline.eyebrow}</Eyebrow>
              <SplitHeading>{licenceTimeline.title}</SplitHeading>
              <Lede>{licenceTimeline.lede}</Lede>
            </div>
          </div>
          <div ref={rootRef} className="mile-rail">
            <div className="spine" aria-hidden="true">
              <div className="spine-fill" />
            </div>
            <ol className="miles">
              {licenceTimeline.milestones.map((item) => (
                <li key={item.title} className="mile" data-kind={item.kind} data-future={item.kind === "done" ? undefined : ""}>
                  <span className="mile-node" />
                  <div className="mile-copy">
                    <p className={`mile-date${item.kind === "done" ? " is-done" : ""}`}>
                      <Copy value={item.date} />
                    </p>
                    <Subheading>{item.title}</Subheading>
                    <Body>
                      <Copy value={item.detail} />
                    </Body>
                    <span className={`mile-pill is-${item.kind}`}>
                      <Copy value={item.status} />
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
