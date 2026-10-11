import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { MediaBand } from "@/components/media/MediaBand";
import { MediaFrame } from "@/components/media/MediaFrame";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import { CountUp } from "@/components/motion/CountUp";
import { DrawPath } from "@/components/motion/DrawPath";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ph } from "@/content/placeholder";
import { Display } from "@/components/type/Display";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Caption } from "@/components/type/Caption";
import { Body } from "@/components/type/Body";
import { Dim, Heading } from "@/components/type/Heading";
import { Lede } from "@/components/type/Lede";
import { Subheading } from "@/components/type/Subheading";

export const metadata: Metadata = {
  title: "Kitchen sink",
  robots: { index: false, follow: false },
};

const paths = [
  "M24 110 C70 70 90 130 140 90 S210 40 250 88 S320 140 376 72",
  "M24 128 C80 96 110 150 160 112 S230 70 280 108 S340 150 376 96",
] as const;

const variants = ["dawn", "ridge", "savanna", "stream", "forest"] as const;

export default function KitchenSinkPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="sink">
      <Container>
        <div className="sink-block">
          <p className="sink-label">Type scale</p>
          <Eyebrow>Eyebrow</Eyebrow>
          <Display>Display</Display>
          <Heading>
            Heading <Dim>and a quieter second part.</Dim>
          </Heading>
          <Subheading>Subheading for a supporting line.</Subheading>
          <Lede>Lede copy sits in a narrower measure, in the warmer off-white.</Lede>
          <Body>Body copy is the long-form text. It stays within 64 characters and uses the softer grey.</Body>
          <Caption>Caption · Geist Mono</Caption>
        </div>

        <div className="sink-block">
          <p className="sink-label">Grid</p>
          <Grid>
            {Array.from({ length: 12 }, (_, index) => (
              <div key={index} className="sink-cell">
                {index + 1}
              </div>
            ))}
          </Grid>
        </div>

        <div className="sink-block">
          <p className="sink-label">Reveal</p>
          <Reveal stagger>
            <Body>First line rises on its own.</Body>
            <Body>The next follows a short stagger.</Body>
            <Body>The third arrives with it, once.</Body>
          </Reveal>
        </div>

        <div className="sink-block">
          <p className="sink-label">Split heading</p>
          <SplitHeading as="h2" className="type-heading">
            Mask lines, rising once.
          </SplitHeading>
        </div>

        <div className="sink-block">
          <p className="sink-label">Scroll words</p>
          <ScrollWords className="type-heading">
            Words light up in reading order as this line crosses the viewport.
          </ScrollWords>
        </div>

        <div className="sink-block">
          <p className="sink-label">Count up</p>
          <p className="type-display">
            <CountUp value={41.09} decimals={2} suffix=" km²" />
          </p>
        </div>

        <div className="sink-block">
          <p className="sink-label">Draw path</p>
          <DrawPath paths={paths} label="Sample contour strokes" />
        </div>
      </Container>

      <div className="sink-block">
        <Container>
          <p className="sink-label">Parallax</p>
        </Container>
        <div className="sink-parallax">
          <Parallax speed={-0.12}>
            <MediaPlaceholder variant="ridge" shot="Parallax sample, cooler ridges" animate={false} />
          </Parallax>
        </div>
      </div>

      <Container>
        <div className="sink-block">
          <p className="sink-label">Image reveal</p>
          <ImageReveal>
            <div className="sink-variant">
              <MediaPlaceholder variant="stream" shot="Image reveal sample" animate={false} />
            </div>
          </ImageReveal>
        </div>

        <div className="sink-block">
          <p className="sink-label">Placeholder variants</p>
          <div className="sink-variants">
            {variants.map((variant) => (
              <div key={variant} className="sink-variant">
                <MediaPlaceholder
                  variant={variant}
                  shot={`${variant} landscape`}
                  animate
                />
                <span className="sink-variant-name">{variant}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="sink-block">
        <Container>
          <p className="sink-label">Media band, short</p>
        </Container>
        <MediaBand id="band-savanna-dawn" height="short" />
      </div>
      <div className="sink-block">
        <Container>
          <p className="sink-label">Media band, tall</p>
        </Container>
        <MediaBand
          id="band-ridge-aerial"
          height="tall"
          overlay={{
            eyebrow: "Overlay",
            heading: ph("A tall band, with a line of its own.", "Kitchen sink band heading"),
            caption: "Caption sits at the lower left",
          }}
        />
      </div>

      <Section tone="ink-2">
        <Container>
          <p className="sink-label">Media frames</p>
          <div className="sink-frames">
            <MediaFrame id="still-outcrop" ratio="16/9" caption="16 / 9" />
            <MediaFrame id="still-badu-town" ratio="4/5" caption="4 / 5" />
            <MediaFrame id="still-team-field" ratio="1/1" caption="1 / 1" />
          </div>
        </Container>
      </Section>

      <div className="sink-block">
        <Container>
          <p className="sink-label">Page hero</p>
        </Container>
        <PageHero
          eyebrow="Page hero"
          title={ph("Review the page hero here.", "Kitchen sink hero")}
          lede={ph("Eyebrow, title and lede enter with the landscape behind them.", "Kitchen sink hero lede")}
          mediaId="band-forest-edge"
        />
      </div>
    </main>
  );
}
