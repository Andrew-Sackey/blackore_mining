/**
 * Shared motion tokens. Components read these instead of writing their own durations.
 * Route timings are the page-transition spec, kept here so they are not inlined.
 */
export const dur = {
  fast: 0.4,
  base: 0.8,
  slow: 1.1,
  cinematic: 1.6,
} as const;

export const ease = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power3.inOut",
  /** Scrubbed scroll has no easing curve. */
  scrub: "none",
} as const;

export const stagger = {
  tight: 0.05,
  base: 0.09,
} as const;

export const rise = {
  sm: 16,
  md: 28,
} as const;

/** Element top reaches 85% of the viewport height. */
export const trigger = {
  start: "top 85%",
} as const;

export const navOffset = 64;

export const route = {
  line: 0.45,
  leave: 0.25,
  enter: 0.5,
  reduced: 0.2,
} as const;

export const scale = {
  enter: 1.06,
  image: 1.12,
} as const;

export const parallax = {
  max: 0.12,
} as const;

export const reducedFade = 0.3;

export const clip = {
  from: "inset(12% 8% round 28px)",
  to: "inset(0% round 28px)",
  fromPhone: "inset(12% 8% round 20px)",
  toPhone: "inset(0% round 20px)",
} as const;

/** Words light up in reading order while the block crosses the viewport. */
export const scrollWords = {
  dim: 0.5,
  scrub: 0.6,
  start: "top 80%",
  end: "bottom 55%",
} as const;

/**
 * Ghana map sequence. Starts when the map's top reaches 70% of the viewport
 * (about 30% of the screen shows the map). Times are seconds on one timeline.
 */
export const mapMotion = {
  start: "top 70%",
  outlineAt: 0.1,
  townsAt: 1.2,
  townStagger: 0.12,
  routeAt: 1.6,
  routeDur: 1.4,
  linkAt: 2.2,
  linkDur: 0.6,
  markerAt: 3.0,
  insetAt: 3.3,
  boundary: 2.2,
  dash: "4 5",
  linkDash: "3 5",
} as const;

/** Copper progress line on the exploration roadmap. */
export const phaseMotion = {
  line: 1.4,
} as const;

/** Geology map tour. Timings follow the approved prototype. */
export const geoTour = {
  view: 0.3,
  outlineStagger: 0.12,
  outlineDur: 2.6,
  boundaryAt: 1.2,
  boundaryDur: 2.2,
  streamFrom: 0.9,
  streamSpan: 1.1,
  streamDur: 1.8,
  structureAt: 1.6,
  structureStagger: 0.04,
  structureDur: 1.4,
  clearAt: 5.2,
  autoDelay: 3.6,
  dwell: 5.2,
  state: 0.85,
} as const;

export const zoomLadder = {
  stagger: 0.5,
} as const;

/** Programme Gantt on the licence page. The brief sets the bar stagger at 0.2s. */
export const programmeMotion = {
  barStagger: 0.2,
} as const;
