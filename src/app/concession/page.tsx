import type { Metadata } from "next";
import { ComparableSettings } from "@/components/concession/ComparableSettings";
import { GeologyMapTour } from "@/components/concession/GeologyMapTour";
import { ReportGlance } from "@/components/concession/ReportGlance";
import { ZoomLadder } from "@/components/concession/ZoomLadder";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { MediaBand } from "@/components/media/MediaBand";
import { MediaFrame } from "@/components/media/MediaFrame";
import { concession, quartzCaption } from "@/content/concession";
import { pageMetadata } from "@/lib/seo";
import "./concession.css";

export const metadata: Metadata = pageMetadata({
  title: "The Badu Concession",
  description:
    "Geology, setting and the desktop study for the 41.09 km² Badu concession in Ghana's Bono Region.",
  path: "/concession",
  image: "/og/og-concession.png",
  imageAlt: "The Badu concession. Geology and setting of the 41.09 km² exploration licence in Ghana's Bono Region.",
});

const baduPlace = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Badu concession",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.66,
    longitude: -2.12,
  },
  containedInPlace: {
    "@type": "Place",
    name: "Bono Region, Ghana",
  },
};

export default function ConcessionPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baduPlace) }} />
      <PageHero
        eyebrow={concession.eyebrow}
        title={concession.title}
        lede={concession.lede}
        mediaId={concession.mediaId}
      />
      <ReportGlance />
      <MediaBand id="band-woodland-walk" height="short" />
      <ZoomLadder />
      <GeologyMapTour />
      <Section space="md" tone="ink">
        <Container>
          <MediaFrame id="still-quartz-float" ratio="16/9" caption={quartzCaption} />
        </Container>
      </Section>
      <ComparableSettings />
    </main>
  );
}
