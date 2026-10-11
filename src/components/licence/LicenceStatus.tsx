"use client";

import { useRef } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { licenceState, licenceStatus } from "@/content/licence";
import { dur, ease } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

export function LicenceStatus() {
  const ref = useRef<HTMLDivElement>(null);
  useTagline(licenceStatus.title);

  useGSAP(
    () => {
      const ring = ref.current?.querySelector(".fact-dot-ring");
      if (!ring || reducedMotion() || licenceState !== "granted") return;
      gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.55 },
        { scale: 2.4, opacity: 0, duration: dur.cinematic, ease: ease.out, repeat: -1 },
      );
    },
    { scope: ref },
  );

  return (
    <Section tone="ink" space="md">
      <Container>
        <div className="section-intro">
          <Eyebrow>{licenceStatus.eyebrow}</Eyebrow>
          <SplitHeading>{licenceStatus.title}</SplitHeading>
        </div>
        <div ref={ref} className="fact-row">
          {licenceStatus.facts.map((fact) => (
            <div key={fact.label} className="fact">
              <Caption>{fact.label}</Caption>
              <p className="fact-value">
                {fact.dot ? (
                  <span className={`fact-dot${licenceState === "granted" ? " is-live" : " is-pending"}`}>
                    <span className="fact-dot-core" />
                    {licenceState === "granted" ? <span className="fact-dot-ring" /> : null}
                  </span>
                ) : null}
                <Copy value={fact.value} />
              </p>
              <Body>
                <Copy value={fact.note} />
              </Body>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
