"use client";

import { useRef } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { CountUp } from "@/components/motion/CountUp";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { licenceSchedule } from "@/content/licence";
import { copyText, isPlaceholder } from "@/content/placeholder";
import { dur, ease, programmeMotion, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

const opacities = [1, 0.75, 0.55, 0.4];
const marks = [0, 3, 6, 9, 12, 15, 18];

function month(value: (typeof licenceSchedule.phases)[number]["start"]) {
  const parsed = Number(copyText(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ProgrammeTimeline() {
  const chartRef = useRef<HTMLDivElement>(null);
  useTagline(licenceSchedule.title);
  const note = isPlaceholder(licenceSchedule.budget) ? licenceSchedule.budget.note : undefined;

  useGSAP(
    () => {
      const chart = chartRef.current;
      if (!chart || reducedMotion()) return;
      const bars = chart.querySelectorAll(".gantt-bar-fill");
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: dur.slow,
          ease: ease.out,
          stagger: programmeMotion.barStagger,
          scrollTrigger: { trigger: chart, start: trigger.start, once: true },
        },
      );
    },
    { scope: chartRef },
  );

  return (
    <Section id="programme" tone="ink-2" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{licenceSchedule.eyebrow}</Eyebrow>
          <SplitHeading>{licenceSchedule.title}</SplitHeading>
          <Body>{licenceSchedule.body}</Body>
        </div>
        <div className="gantt-scroll">
          <div ref={chartRef} className="gantt">
            <div className="gantt-plot">
              <div className="gantt-months" aria-hidden="true">
                {marks.map((mark) => (
                  <span key={mark} style={{ left: `${(mark / licenceSchedule.span) * 100}%` }}>
                    {mark}
                  </span>
                ))}
              </div>
              <div className="gantt-grid" aria-hidden="true">
                {marks.map((mark) => (
                  <span key={mark} style={{ left: `${(mark / licenceSchedule.span) * 100}%` }} />
                ))}
              </div>
              <ol className="gantt-rows">
                {licenceSchedule.phases.map((phase, index) => {
                  const start = month(phase.start);
                  const end = month(phase.end);
                  const span = licenceSchedule.span;
                  const wide = end - start >= 5;
                  return (
                    <li key={phase.title} className="gantt-row">
                      <div
                        className="gantt-bar"
                        style={{
                          left: `${(start / span) * 100}%`,
                          width: `${((end - start) / span) * 100}%`,
                        }}
                      >
                        <div className="gantt-bar-fill" style={{ opacity: opacities[index] ?? 0.4 }} />
                        <span className={`gantt-label${wide ? " is-in" : " is-out"}`}>
                          {phase.title}
                          <span className="gantt-range">
                            <Copy value={phase.start} />–<Copy value={phase.end} />
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
        <p className="budget-figure" data-ph={note ? "" : undefined} data-ph-note={note} title={note}>
          <span className="budget-prefix">US$</span>
          <CountUp value={licenceSchedule.budgetValue} decimals={2} />
          <span>–1.0M</span>
        </p>
        <Caption className="is-sentence">{licenceSchedule.budgetCaption}</Caption>
      </Container>
    </Section>
  );
}
