export type IntroMode = "full" | "short" | "none";

const SEEN_KEY = "bo-intro-seen";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function clearIntroSeen(): void {
  try {
    sessionStorage.removeItem(SEEN_KEY);
  } catch {
    /* private mode */
  }
}

/** Home-page mode. Reduced motion wins, then a return visit in this session. */
export function resolveIntroMode(): IntroMode {
  if (prefersReducedMotion()) return "none";
  if (hasSeenIntro()) return "short";
  return "full";
}

declare global {
  interface Window {
    __BO_INTRO__?: IntroMode;
  }
}
