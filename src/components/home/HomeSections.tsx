"use client";

import { useRef } from "react";
import { home } from "@/content/home";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { LocationMap } from "@/components/home/LocationMap";
import { PhaseTrack } from "@/components/home/PhaseTrack";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { MediaBand } from "@/components/media/MediaBand";
import { MediaFrame } from "@/components/media/MediaFrame";
import { DrawPath } from "@/components/motion/DrawPath";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { Subheading } from "@/components/type/Subheading";
import { dur, ease, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

function wave(y: number) {
  return `M24 ${y}C78 ${y - 16},128 ${y + 14},176 ${y}S252 ${y - 12},296 ${y + 2}`;
}

const strata = [48, 82, 116, 150, 184].map((y, index) => ({
  d: wave(y),
  accent: index === 2,
}));

const faults = [
  { d: "M70 210 L100 30" },
  { d: "M110 216 L140 36" },
  { d: "M150 222 L180 42" },
  { d: "M24 78 L300 128" },
  { d: "M24 112 L300 162" },
  { d: "M24 146 L300 196" },
];

const intrusion = [
  {
    d: "M160 36C220 36 268 78 268 128C268 186 220 214 160 214C100 214 52 186 52 128C52 78 100 36 160 36Z",
    accent: true,
  },
  { d: "M268 128 H304" },
  { d: "M230 58 L262 28" },
  { d: "M160 36 V12" },
  { d: "M90 58 L58 28" },
  { d: "M52 128 H16" },
  { d: "M160 214 V232" },
  { d: "M230 196 L262 222" },
  { d: "M90 196 L58 222" },
];

const figures = [strata, faults, intrusion] as const;

function CardTitle({ text }: { text: string }) {
  useTagline(text);
  return <Subheading>{text}</Subheading>;
}

function FaultPulse() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      gsap.to(el, {
        scale: 1.55,
        opacity: 0.45,
        duration: dur.base,
        ease: ease.out,
        yoyo: true,
        repeat: -1,
        transformOrigin: "center",
        scrollTrigger: { trigger: el, start: trigger.start, once: true },
      });
    },
    { scope: ref },
  );
  return <span ref={ref} className="geo-pulse" />;
}

export function Statement() {
  useTagline(home.statement.line);
  return (
    <MediaBand id={home.statement.mediaId} height="tall" align="statement" shade="left">
      <ScrollWords className="statement-line">{home.statement.line}</ScrollWords>
      <Reveal>
        <Lede className="statement-lede">{home.statement.lede}</Lede>
      </Reveal>
    </MediaBand>
  );
}

export function LocationAccess() {
  useTagline(home.location.title);
  return (
    <Section id="location" tone="ink" space="lg" className="location-section">
      <Container>
        <Grid className="location-layout">
          <div className="location-copy">
            <Eyebrow>{home.location.eyebrow}</Eyebrow>
            <SplitHeading className="type-heading">{home.location.title}</SplitHeading>
            <Lede>{home.location.lede}</Lede>
            <Reveal stagger className="facts">
              {home.location.facts.map((fact) => (
                <div key={fact.label}>
                  <Caption>{fact.label}</Caption>
                  <Body className="fact-line">{fact.line}</Body>
                </div>
              ))}
            </Reveal>
            <MediaFrame id={home.location.frameId} ratio="16/9" />
          </div>
          <LocationMap />
        </Grid>
      </Container>
    </Section>
  );
}

export function GeologicalSetting() {
  useTagline(home.geology.title);
  return (
    <Section tone="ink-2" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{home.geology.eyebrow}</Eyebrow>
          <SplitHeading className="type-heading">{home.geology.title}</SplitHeading>
          <Lede>{home.geology.lede}</Lede>
        </div>
        <div className="geo-cards">
          {home.geology.cards.map((card, index) => (
            <article key={card.title} className="geo-card">
              <div className="geo-figure">
                <DrawPath
                  className="geo-draw"
                  viewBox="0 0 320 240"
                  paths={figures[index]}
                  label={card.title}
                />
                {index === 1 ? <FaultPulse /> : null}
              </div>
              <div className="geo-card-copy">
                <CardTitle text={card.title} />
                <Body>{card.body}</Body>
              </div>
            </article>
          ))}
        </div>
        <Grid className="geo-follow">
          <div className="geo-frame">
            <MediaFrame id={home.geology.frameId} ratio="16/9" />
          </div>
        </Grid>
        <div className="geo-foot">
          <Caption className="is-sentence">{home.geology.source}</Caption>
          <TransitionLink href={home.geology.href} className="text-link">
            {home.geology.link} <span aria-hidden="true">→</span>
          </TransitionLink>
        </div>
      </Container>
    </Section>
  );
}

export function ExplorationRoadmap() {
  useTagline(home.roadmap.title);
  return (
    <Section tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{home.roadmap.eyebrow}</Eyebrow>
          <SplitHeading className="type-heading">{home.roadmap.title}</SplitHeading>
          <Lede>{home.roadmap.lede}</Lede>
        </div>
        <PhaseTrack phases={home.roadmap.phases} />
        <div className="roadmap-foot">
          <Caption className="is-sentence">
            <Copy value={home.roadmap.note} />
          </Caption>
          <TransitionLink href={home.roadmap.href} className="text-link">
            {home.roadmap.link} <span aria-hidden="true">→</span>
          </TransitionLink>
        </div>
      </Container>
    </Section>
  );
}

export function ClosingBand() {
  useTagline(home.closing.title);
  return (
    <MediaBand id={home.closing.mediaId} height="tall" align="center" shade="center">
      <Eyebrow>{home.closing.eyebrow}</Eyebrow>
      <SplitHeading className="type-heading closing-title">{home.closing.title}</SplitHeading>
      <Body className="closing-body">{home.closing.body}</Body>
      <div className="ctas closing-ctas">
        <TransitionLink href={home.closing.primaryHref} className="btn" data-cta={home.closing.primary}>
          {home.closing.primary}
        </TransitionLink>
        <TransitionLink href={home.closing.secondaryHref} className="text-link">
          {home.closing.secondary} <span aria-hidden="true">→</span>
        </TransitionLink>
      </div>
    </MediaBand>
  );
}
