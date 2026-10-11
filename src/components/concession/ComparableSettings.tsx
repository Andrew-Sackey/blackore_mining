"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { comparison } from "@/content/concession";
import { gsap } from "@/lib/gsap";
import { dur, ease, rise, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

const fields = ["host", "structure", "intrusive", "style"] as const;

export function ComparableSettings() {
  const root = useRef<HTMLDivElement>(null);
  useTagline(comparison.title);

  useGSAP(
    () => {
      const node = root.current;
      if (!node || reducedMotion()) return;
      const mm = gsap.matchMedia();
      const riseIn = (selector: string) => {
        gsap.fromTo(
          selector,
          { opacity: 0, y: rise.sm },
          {
            opacity: 1,
            y: 0,
            duration: dur.base,
            stagger: stagger.tight,
            ease: ease.out,
            scrollTrigger: { trigger: node, start: trigger.start, once: true },
          },
        );
      };
      mm.add("(min-width: 768px)", () => {
        riseIn(".compare-row");
        gsap.fromTo(
          ".badu-edge",
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: dur.slow,
            ease: ease.out,
            scrollTrigger: { trigger: node, start: trigger.start, once: true },
          },
        );
      });
      mm.add("(max-width: 767px)", () => {
        riseIn(".compare-card");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Section id="comparable" tone="ink-2" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{comparison.eyebrow}</Eyebrow>
          <SplitHeading>{comparison.title}</SplitHeading>
          <Lede>{comparison.lede}</Lede>
        </div>
        <div ref={root}>
          <div className="compare-cards">
            {comparison.rows.map((row) => (
              <article className="compare-card" key={row.project}>
                <h3>{row.project}</h3>
                {fields.map((field, index) => (
                  <p key={field}>
                    <span>{comparison.columns[index + 1]}</span>
                    {row[field]}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <table className="compare-table">
            <thead>
              <tr>
                {comparison.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr className={row.project === "Badu" ? "compare-row is-badu" : "compare-row"} key={row.project}>
                  <th>
                    {row.project === "Badu" && <span className="badu-edge" aria-hidden="true" />}
                    {row.project}
                  </th>
                  <td>{row.host}</td>
                  <td>{row.structure}</td>
                  <td>{row.intrusive}</td>
                  <td>{row.style}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Caption className="compare-note is-sentence">{comparison.note}</Caption>
      </Container>
    </Section>
  );
}
