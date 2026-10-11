import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { CoreLog } from "@/components/about/CoreLog";
import { People } from "@/components/about/People";
import { Principles } from "@/components/about/Principles";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { MediaBand } from "@/components/media/MediaBand";
import { MediaFrame } from "@/components/media/MediaFrame";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { aboutClose, aboutHero } from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Who BlackOre is, why we chose Badu, and how we explore: in careful stages, guided by geology and plain reporting.",
  path: "/about",
  image: "/og/og-about.png",
  imageAlt: "BlackOre Mining. About the company exploring the Badu concession in Ghana's Bono Region.",
});

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        lede={aboutHero.lede}
        mediaId={aboutHero.mediaId}
        survey
      />
      <AboutIntro />
      <CoreLog />
      <MediaBand id="band-harmattan-haze" height="short" />
      <Principles />
      <People />
      <Section tone="ink" space="lg">
        <Container>
          <div className="about-frame">
            <MediaFrame id="still-community" ratio="16/9" />
          </div>
        </Container>
      </Section>
      <div className="about-close">
        <Container>
          <Body>{aboutClose.line}</Body>
          <TransitionLink href={aboutClose.href} className="btn" data-cta={aboutClose.cta}>
            {aboutClose.cta}
          </TransitionLink>
        </Container>
      </div>
    </main>
  );
}
