import type { Metadata } from "next";
import { LicenceGlance } from "@/components/concession/LicenceGlance";
import { LicenceStatus } from "@/components/licence/LicenceStatus";
import { MilestoneSpine } from "@/components/licence/MilestoneSpine";
import { Partnerships } from "@/components/licence/Partnerships";
import { PhaseExplorer } from "@/components/licence/PhaseExplorer";
import { ProgrammeTimeline } from "@/components/licence/ProgrammeTimeline";
import { Responsible } from "@/components/licence/Responsible";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { MediaBand } from "@/components/media/MediaBand";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { licenceClose, licenceHero } from "@/content/licence";
import { pageMetadata } from "@/lib/seo";
import "./licence.css";

export const metadata: Metadata = pageMetadata({
  title: "Licence & Roadmap",
  description:
    "The Badu licence, its surveyed boundary and the four-phase exploration programme from reconnaissance to drilling.",
  path: "/licence",
  image: "/og/og-licence.png",
  imageAlt: "Licence and roadmap for the Badu exploration programme, from reconnaissance to drilling.",
});

export default function LicencePage() {
  return (
    <main>
      <PageHero
        eyebrow={licenceHero.eyebrow}
        title={licenceHero.title}
        lede={licenceHero.lede}
        mediaId={licenceHero.mediaId}
      />
      <LicenceStatus />
      <LicenceGlance />
      <MilestoneSpine />
      <MediaBand id="band-survey-pillar" height="short" />
      <PhaseExplorer />
      <ProgrammeTimeline />
      <Partnerships />
      <Responsible />
      <div className="licence-ask">
        <Container>
          <p>
            {licenceClose.line}{" "}
            <TransitionLink href={licenceClose.href} className="text-link">
              {licenceClose.link} <span>→</span>
            </TransitionLink>
          </p>
        </Container>
      </div>
    </main>
  );
}
