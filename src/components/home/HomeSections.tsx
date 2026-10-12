"use client";

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
import { Reveal } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";

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
