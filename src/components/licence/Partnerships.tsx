"use client";

import { useRef } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { licenceOptions } from "@/content/licence";
import { dur, ease, rise, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

const icons: Record<(typeof licenceOptions.cards)[number]["icon"], readonly string[]> = {
  stake: ["M5 16 L10 8 L14 12 L19 5", "M19 5 V9", "M19 5 H15"],
  venture: ["M8.5 12 a3.5 3.5 0 1 0 0.01 0", "M15.5 12 a3.5 3.5 0 1 0 0.01 0"],
  phase: ["M5 12 H19"],
  technical: ["M12 4.5 V8", "M12 16 V19.5", "M4.5 12 H8", "M16 12 H19.5", "M12 12 m-5.5 0 a5.5 5.5 0 1 0 11 0 a5.5 5.5 0 1 0 -11 0"],
};

export function Partnerships() {
  const ref = useRef<HTMLDivElement>(null);
  useTagline(licenceOptions.title);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      const cards = root.querySelectorAll(".option-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: rise.md },
        {
          opacity: 1,
          y: 0,
          duration: dur.base,
          ease: ease.out,
          stagger: stagger.base,
          scrollTrigger: { trigger: root, start: trigger.start, once: true },
        },
      );

      const cleanups: Array<() => void> = [];
      cards.forEach((card) => {
        const redraw = () => {
          if (window.matchMedia("(hover: none)").matches) return;
          card.querySelectorAll("path").forEach((path) => {
            const length = path.getTotalLength();
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: dur.base, ease: ease.inOut },
            );
          });
        };
        card.addEventListener("mouseenter", redraw);
        cleanups.push(() => card.removeEventListener("mouseenter", redraw));
      });
      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: ref },
  );

  return (
    <Section tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{licenceOptions.eyebrow}</Eyebrow>
          <SplitHeading>{licenceOptions.title}</SplitHeading>
          <Lede>
            <Copy value={licenceOptions.lede} />
          </Lede>
        </div>
        <div ref={ref} className="option-grid">
          {licenceOptions.cards.map((card) => (
            <article key={card.icon} className="option-card">
              <svg className="option-icon" viewBox="0 0 24 24" aria-hidden="true">
                {icons[card.icon].map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
              <h3 className="option-title">
                <Copy value={card.title} />
              </h3>
              <p className="option-body">
                <Copy value={card.body} />
              </p>
              <TransitionLink href={licenceOptions.href} className="text-link">
                {licenceOptions.link} <span>→</span>
              </TransitionLink>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
