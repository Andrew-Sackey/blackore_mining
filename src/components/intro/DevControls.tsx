"use client";

import { useIntro } from "@/components/intro/IntroContext";

export function DevControls() {
  const { replay, slowVideo, setSlowVideo, videoReady, forcedMode } = useIntro();

  return (
    <div className="proto" aria-label="Prototype controls">
      <button type="button" onClick={() => replay("full")}>
        Replay intro
      </button>
      <button type="button" aria-pressed={forcedMode === "short"} onClick={() => replay("short")}>
        Short
      </button>
      <button
        type="button"
        aria-pressed={slowVideo}
        onClick={() => {
          setSlowVideo(!slowVideo);
          replay(forcedMode === "short" ? "short" : "full");
        }}
      >
        Slow video
      </button>
      <span className={videoReady ? "state ready" : "state"}>
        <i />
        {videoReady ? "Video ready" : "Video loading"}
      </span>
    </div>
  );
}
