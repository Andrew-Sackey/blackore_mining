"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { clearIntroSeen, type IntroMode } from "@/components/intro/intro-mode";

type IntroContextValue = {
  replayToken: number;
  forcedMode: IntroMode | null;
  slowVideo: boolean;
  setSlowVideo: (value: boolean) => void;
  videoReady: boolean;
  videoReadyRef: RefObject<boolean>;
  onVideoReadyRef: RefObject<(() => void) | null>;
  reportVideoReady: () => void;
  posterFallback: boolean;
  setPosterFallback: (value: boolean) => void;
  replay: (mode: IntroMode) => void;
  navLogoRef: RefObject<HTMLAnchorElement | null>;
  heroMediaRef: RefObject<HTMLDivElement | null>;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const navLogoRef = useRef<HTMLAnchorElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const videoReadyRef = useRef(false);
  const onVideoReadyRef = useRef<(() => void) | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [posterFallback, setPosterFallback] = useState(false);
  const [slowVideo, setSlowVideo] = useState(false);
  const [forcedMode, setForcedMode] = useState<IntroMode | null>(null);
  const [replayToken, setReplayToken] = useState(0);

  const reportVideoReady = useCallback(() => {
    videoReadyRef.current = true;
    setVideoReady(true);
    const ready = onVideoReadyRef.current;
    onVideoReadyRef.current = null;
    ready?.();
  }, []);

  const resetVideoGate = useCallback(() => {
    videoReadyRef.current = false;
    onVideoReadyRef.current = null;
    setVideoReady(false);
    setPosterFallback(false);
  }, []);

  const replay = useCallback(
    (mode: IntroMode) => {
      clearIntroSeen();
      resetVideoGate();
      setForcedMode(mode);
      document.documentElement.dataset.intro = mode;
      window.__BO_INTRO__ = mode;
      if (window.innerWidth < 640 && mode !== "none") {
        document.documentElement.classList.add("is-stacked");
      }
      const intro = document.getElementById("intro");
      if (intro) {
        intro.style.display = mode === "none" ? "none" : "grid";
        intro.style.backgroundColor = "";
        intro.style.opacity = "1";
        intro.style.visibility = "visible";
        intro.classList.remove("is-settled");
      }
      window.scrollTo(0, 0);
      setReplayToken((token) => token + 1);
    },
    [resetVideoGate],
  );

  const value = useMemo<IntroContextValue>(
    () => ({
      replayToken,
      forcedMode,
      slowVideo,
      setSlowVideo,
      videoReady,
      videoReadyRef,
      onVideoReadyRef,
      reportVideoReady,
      posterFallback,
      setPosterFallback,
      replay,
      navLogoRef,
      heroMediaRef,
    }),
    [replayToken, forcedMode, slowVideo, videoReady, posterFallback, reportVideoReady, replay],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroContextValue {
  const value = useContext(IntroContext);
  if (!value) throw new Error("useIntro must be used within IntroProvider");
  return value;
}
