import type { Metadata } from "next";
import { ComparableSettings } from "@/components/concession/ComparableSettings";
import { GeologyMapTour } from "@/components/concession/GeologyMapTour";
import { ReportGlance } from "@/components/concession/ReportGlance";
import { ZoomLadder } from "@/components/concession/ZoomLadder";
import { PageHero } from "@/components/layout/PageHero";
import { concession } from "@/content/concession";
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
      <ZoomLadder />
      <GeologyMapTour />
      <ComparableSettings />
    </main>
  );
}
