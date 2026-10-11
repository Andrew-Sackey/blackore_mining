import {
  ClosingBand,
  ExplorationRoadmap,
  GeologicalSetting,
  LocationAccess,
  Statement,
} from "@/components/home/HomeSections";
import { Hero } from "@/components/hero/Hero";
import { OpeningSequence } from "@/components/intro/OpeningSequence";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <Hero
        srcMobile={{
          webm: "",
          mp4: "/media/hero-loop-mobile.mp4",
        }}
        srcDesktop={{
          webm: "",
          mp4: "/media/hero-loop-desktop.mp4",
        }}
        poster="/media/hero-loop-poster.jpg"
      >
        <Statement />
        <LocationAccess />
        <GeologicalSetting />
        <ExplorationRoadmap />
        <ClosingBand />
      </Hero>
      <OpeningSequence />
    </>
  );
}
