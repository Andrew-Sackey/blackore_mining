"use client";

import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/intro/IntroContext";
import { TerrainPlaceholder } from "@/components/hero/TerrainPlaceholder";

export type VideoSource = { webm: string; mp4: string };

type HeroMediaProps = {
  srcMobile?: VideoSource;
  srcDesktop?: VideoSource;
  poster?: string;
};

function saveDataOn(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

export function HeroMedia({ srcMobile, srcDesktop, poster }: HeroMediaProps) {
  const { heroMediaRef, reportVideoReady, replayToken, slowVideo, videoReady } = useIntro();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tier, setTier] = useState<"mobile" | "desktop" | null>(null);
  const [posterState, setPosterState] = useState({ token: replayToken, posterOnly: false });
  if (posterState.token !== replayToken) {
    setPosterState({ token: replayToken, posterOnly: false });
  }
  const posterOnly = posterState.posterOnly;

  useEffect(() => {
    const width = window.innerWidth;
    const chosen = width < 768 ? "mobile" : "desktop";
    // Width is only known on the client. Measuring in an effect avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTier(chosen);
  }, []);

  const source = tier === "mobile" ? srcMobile : tier === "desktop" ? srcDesktop : undefined;
  const hasFile = Boolean(source && (source.webm || source.mp4));

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) reportVideoReady();
    };

    if (hasFile && saveDataOn()) {
      // saveData is a browser signal; the poster swap has to happen after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosterState((state) => ({ ...state, posterOnly: true }));
      done();
      return () => {
        cancelled = true;
      };
    }

    if (!hasFile || !source) {
      const timer = window.setTimeout(done, slowVideo ? 9000 : 2400);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    // Poster-only is a browser playback decision, applied after this effect starts.

    const video = videoRef.current;
    if (!video) return;

    const onReady = () => done();
    if (video.readyState >= 3) onReady();
    else video.addEventListener("canplaythrough", onReady);

    const playback = video.play();
    playback?.catch(() => {
      setPosterState((state) => ({ ...state, posterOnly: true }));
      done();
    });
    const onError = () => {
      setPosterState((state) => ({ ...state, posterOnly: true }));
      done();
    };
    video.addEventListener("error", onError);

    const root = video.parentElement;
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    });
    if (root) onScreen.observe(root);

    return () => {
      cancelled = true;
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("error", onError);
      onScreen.disconnect();
    };
  }, [hasFile, reportVideoReady, replayToken, slowVideo, source]);

  return (
    <div className="hero-media" ref={heroMediaRef}>
      {hasFile && source && !posterOnly ? (
        <video
          ref={videoRef}
          key={`${tier}-${replayToken}`}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden="true"
        >
          {source.webm ? <source src={source.webm} type="video/webm" /> : null}
          {source.mp4 ? <source src={source.mp4} type="video/mp4" /> : null}
        </video>
      ) : hasFile && poster ? (
        // Poster stands in until footage can play. Empty alt: the hero headline names the scene.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" />
      ) : (
        <TerrainPlaceholder animate={videoReady} />
      )}
    </div>
  );
}
